import Tour from './../models/tourModel.js';
import User from './../models/userModel.js';
import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';

export const getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
    });
});
export const getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({
        nameSlug: req.params.nameSlug,
    }).setOptions({
        populateGuides: true,
        populateReviews: true,
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
    });
});
export const getLoginForm = catchAsync(async (req, res, next) => {
    res.status(200).render('login', {
        title: `Log Into Your Account`,
    });
});
export const getAccount = catchAsync(async (req, res, next) => {
    res.status(200).render('account', {
        title: `Your Account`,
        user: req.user,
    });
});
export const getSignupForm = catchAsync(async (req, res, next) => {
    res.status(200).render('signup', {
        title: `Create your account`,
    });
});
export const getVerifyEmailForm = catchAsync(async (req, res, next) => {
    res.status(200).render('verifyEmail', {
        title: `Verify your email`,
        email: req.query.email || '',
    });
});
export const getForgotPasswordForm = catchAsync(async (req, res, next) => {
    res.status(200).render('forgotPassword', {
        title: `Forgot Password`,
    });
});
export const getResetPasswordForm = catchAsync(async (req, res, next) => {
    res.status(200).render('resetPassword', {
        title: `Reset Password`,
        token: req.params.token,
    });
});
