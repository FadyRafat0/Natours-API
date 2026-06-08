/*
    200	OK	         "Here are your tours!"
    201	Created	     "User account created successfully!"
    204	No Content	 "Tour deleted successfully." (Sends no data back)
    400	Bad Request	 "You forgot the passwordConfirm field."
    401	Unauthorized "Wrong password / Invalid JWT token."
    403	Forbidden	 "You are not an admin. Access denied."
    404	Not Found	 "No tour found with that ID."
    500	Server Error "Something broke on our end."
*/

import { promisify } from 'util'; // to convert callback based function to promise based function

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Email from '../utils/email.js';
import sendEmail from '../utils/email.js';

// to protect the routes that only logged in users can access
export const authenticateUser = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let { authorization } = req.headers;
    let token = undefined;
    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
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

    // to make the user data available in the next middlewares
    req.user = user;
    res.locals.user = user;
    next();
});
export const checkEmailVerified = catchAsync(async (req, res, next) => {
    if (!req.user.isEmailConfirmed) {
        return next(
            new AppError(
                'Your email address is not verified. Please verify it to perform this action.',
                403,
            ),
        );
    }
    next();
});
// checked if the user logged in , no errors!
export const isLoggedIn = async (req, res, next) => {
    try {
        let token = req.cookies.jwt;

        // 1) check if the token exist
        if (!token) return next();

        // 2) Check if the token is valid
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET,
        );

        // 3) Check if the user still exists
        const user = await User.findById(decoded.id);
        if (!user) return next();

        // 4) Check if user changed password after the token was issued
        if (user.changedPasswordAfter(decoded.iat)) return next();

        res.locals.user = user;
        next();
    } catch (err) {
        next();
    }
};
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
    // console.log(req.body);
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    // Fire email asynchronously — do NOT block the response
    const url = `${req.protocol}://${req.get('host')}/me`;
    // Send welcome email without awaiting to avoid delaying signup response
    new Email(user, url).sendWelcome();

    // Log the user in immediately
    createSendToken(user, 201, res);
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

    let isCorrectPassword = false;
    if (user) {
        isCorrectPassword = await user.isCorrectPassword(
            password,
            user.password,
        );
    } else {
        // Prevent timing attack by performing a dummy hash calculation (takes ~100ms)
        await bcrypt.hash('dummy_password', 12);
    }

    if (!user || !isCorrectPassword) {
        return next(new AppError('Wrong Email or password', 401));
    }

    createSendToken(user, 200, res);
});
export const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
};

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
        // Fake Respond
        return res.status(200).json({
            status: 'success',
            message:
                'If an account with that email exists, a password reset link has been sent',
        });
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
        // 3) Send the token into the user email
        const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

        await new Email(user, resetURL).sendPasswordReset();

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

        next(
            new AppError(
                'There was an error sending the email. Try again later!',
                500,
            ),
        );
    }
});

export const resetPassword = catchAsync(async (req, res, next) => {
    const resetToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: resetToken,
        passwordResetExpires: { $gte: Date.now() },
    });

    if (!user) {
        return next(
            new AppError(
                'Token is invalid or has expired, try again later!',
                400,
            ),
        );
    }

    // 1) Set new passwords
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    // 2) Clear reset tokens
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // 3) AUTO-CONFIRM THE EMAIL! (Since they clicked an emailed link to get here)
    if (!user.isEmailConfirmed) {
        user.isEmailConfirmed = true;
        user.emailOTP = undefined;
        user.emailOTPExpiresAt = undefined;
    }

    // 4) Save with validation ON so Mongoose checks the passwords match
    await user.save({ validateBeforeSave: true });

    // 5) Log them in immediately
    createSendToken(user, 200, res);
});

// EMAIL Operations (verify, resend verification)
export const verifyEmail = catchAsync(async (req, res, next) => {
    const { otp } = req.body;

    if (!otp) return next(new AppError('Please provide the OTP', 400));

    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ emailVerificationToken: hashedToken });

    const genericError = new AppError('Invalid or expired OTP', 401);

    if (!user || user.isEmailConfirmed) {
        return next(genericError);
    }

    // Check the OTP correctness & expiration
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    if (hashedOTP !== user.emailOTP || user.emailOTPExpiresAt <= Date.now()) {
        return next(genericError);
    }

    user.isEmailConfirmed = true;
    user.emailOTP = undefined;
    user.emailOTPExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res);
});
export const resendEmailVerification = catchAsync(async (req, res, next) => {
    if (req.user.isEmailConfirmed) {
        return res.status(200).json({
            status: 'success',
            message: 'Email Already Confirmed!',
        });
    }

    const user = await User.findById(req.user.id);
    // Make the otp & email token save them in DB
    const otp = user.createEmailOTP();
    const token = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send email
    const url = `${req.protocol}://${req.get('host')}/verify-email/${token}`;
    try {
        await new Email(user, url).sendEmailVerification(otp);

        res.status(200).json({
            status: 'success',
            message: 'OTP sent to email! Please check your inbox.',
        });
    } catch (err) {
        user.emailOTP = undefined;
        user.emailVerificationToken = undefined;
        user.emailOTPExpiresAt = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError(
                'There was an error sending the email. Try again later!',
                500,
            ),
        );
    }
});
