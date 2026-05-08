/*
    Codes related to authentication and authorization
    401: Unauthorized
    403: Forbidden
    429: Too many requests
*/

import { promisify } from 'util'; // to convert callback based function to promise based function
import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import sendEmail from '../utils/email.js';
import crypto from 'crypto';

// MIDDLEWARES
// to protect the routes that only logged in users can access
export const authenticateUser = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let { authorization } = req.headers;
    let token = undefined;
    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Please log in to get access.',
                401,
            ),
        );
    }

    // 2) Check if the token is valid
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);

    // 3) Check if the user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401,
            ),
        );
    }

    // 4) Check if user changed password after the token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password! Please log in again.',
                401,
            ),
        );
    }

    // 5) Check email verfied
    if (!req.user.isEmailConfirmed) {
        return next(
            new AppError(
                'Your email address is not verified. Please verify it to perform this action.',
                403,
            ),
        );
    }

    // to make the user data available in the next middlewares
    req.user = user;
    next();
});
// to restrict the access to certain routes based on user role
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    403,
                ),
            );
        }
        next();
    };
};

// JWT (Create & Send)
// to create a token for the user
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() +
                process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),
        // secure -> send the cookie if the connection is https
        secure: true,
        // to make it read-only no javascript code can edit it
        httpOnly: true,
    });
    res.status(statusCode).json({
        status: 'success',
        token,
        data: user,
    });
};

// to sign up the user and send the token to client
export const signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,
    });

    const otp = user.createEmailOTP();
    await user.save({ validateBeforeSave: false });

    // send email with otp
    const URL = `${req.protocol}://${req.get('host')}/api/v1/users/verifyEmail`;
    await sendEmail({
        email: user.email,
        subject: 'confirm email with OTP (10 minutes valid)',
        message: `Click the URL: ${URL} , and write the OTP: ${otp}`,
    });

    res.status(201).json({
        status: 'success',
        message: 'Check your email, confirm it with OTP send !',
    });
});
// to login the user and send the token to client
export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // console.log(email, password);

    // 1) check the email and password exist
    if (!email || !password) {
        return next(new AppError('Please Enter the email and password', 400));
    }

    // 2) check the user exist & password is right
    const user = await User.findOne({
        email,
    }).select('+password');
    // console.log(user);
    if (!user || !(await user.isCorrectPassword(password, user.password))) {
        return next(new AppError('Wrong Email or password', 401));
    }

    if (!user.isEmailConfirmed) {
        return next(
            new AppError('Please confirm your email address to log in', 401),
        );
    }

    createSendToken(user, 200, res);
});

// PASSWORD Operations (Update, Forgot, Reset)
export const updatePassword = catchAsync(async (req, res, next) => {
    // Get user from the collection
    const user = await User.findById(req.user.id).select('+password');

    // Check if the posted password is correct
    if (!(await user.isCorrectPassword(req.body.oldPassword, user.password))) {
        return next(new AppError('Wrong Password', 401));
    }

    // If so, update the password
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save({ validateBeforeSave: true });

    createSendToken(user, 200, res);
});
export const forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on email
    const user = await User.findOne({
        email: req.body.email,
    });

    // To prevent Email Enumeration attacks
    if (!user) {
        return next(
            new AppError(
                'If an account with that email exists, a password reset link has been sent',
                200,
            ),
        );
    }

    if (!user.isEmailConfirmed) {
        return next(
            new AppError(
                'Please confirm the email address to reset the password',
                401,
            ),
        );
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({
        validateBeforeSave: false,
    });

    // 3) Send the token into the user email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Reset Password (10 minutes valid)',
            message,
        });

        res.status(200).json({
            status: 'success',
            message:
                'If an account with that email exists, a password reset link has been sent',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({
            validateBeforeSave: false,
        });

        return next(
            new AppError(
                'There was an error sending the email. Try again later!',
                500,
            ),
        );
    }
});
export const resetPassword = catchAsync(async (req, res, next) => {
    // Get user based on the token
    const resetToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: resetToken,
        passwordResetExpires: {
            $gte: Date.now(),
        },
    });

    // If token has not expired , and there is user, set new password
    if (!user) {
        return next(
            new AppError(
                'Token is invalid or has expired, try again later!',
                400,
            ),
        );
    }

    // need to reset the passwordResetToken , passwordResetExpires (they are 1 time reset passwords)
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: true });

    createSendToken(user, 200, res);
});

// EMAIL Operations (verify, resend verification)
export const verifyEmail = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email });

    // No user with this email
    if (!user) return next(new AppError('Wrong Email !', 400));

    // Email already confirmed
    if (user.isEmailConfirmed) {
        return next(
            new AppError('This email already verified, Please log in', 400),
        );
    }

    // Check the OTP correctness & expiration
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    if (hashedOTP !== user.emailOTP || user.emailOTPExpiresIn <= Date.now()) {
        return next(new AppError('Wrong or Expired OTP, try again later', 400));
    }

    user.isEmailConfirmed = true;
    user.emailOTP = undefined;
    user.emailOTPExpiresIn = undefined;
    await user.save({ validateBeforeSave: false }); // Save the changes

    createSendToken(user, 200, res);
});
export const resendEmailVerification = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return next(new AppError('Wrong Email !', 400));

    // Email already confirmed
    if (user.isEmailConfirmed) {
        return next(
            new AppError('This email already verified, Please log in', 400),
        );
    }

    // Make the otp & save it in DB
    const otp = user.createEmailOTP();
    await user.save({ validateBeforeSave: false });

    // Send email
    const URL = `${req.protocol}://${req.get('host')}/api/v1/users/confirmEmail`;
    await sendEmail({
        email: user.email,
        subject: 'Your NEW OTP (10 minutes valid)',
        message: `Click the URL: ${URL} , and write the OTP: ${otp}`,
    });

    res.status(200).json({
        status: 'success',
        message: 'Check your email !',
    });
});
