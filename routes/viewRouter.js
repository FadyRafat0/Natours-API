import express from 'express';
import * as viewController from './../controllers/viewController.js';
import * as authController from './../controllers/authController.js';
import * as bookController from './../controllers/bookingController.js';

const router = express.Router();

router.use(authController.isLoggedIn);

router.get(
    '/',
    bookController.createBookingCheckout,
    viewController.getOverview,
);
router.get('/tour/:nameSlug', viewController.getTour);
router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);
router.get('/verify-email/:token', viewController.getVerifyEmailForm);
router.get('/forgot-password', viewController.getForgotPasswordForm);
router.get('/reset-password/:token', viewController.getResetPasswordForm);

router.get('/me', authController.authenticateUser, viewController.getAccount);
router.get(
    '/my-tours',
    authController.authenticateUser,
    viewController.getMyTours,
);

export default router;
