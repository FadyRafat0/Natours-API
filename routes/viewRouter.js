import express from 'express';
import * as viewController from './../controllers/viewController.js';
import * as authController from './../controllers/authController.js';

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get(
    '/tour/:nameSlug',
    authController.isLoggedIn,
    viewController.getTour,
);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);
router.get('/verify-email', authController.isLoggedIn, viewController.getVerifyEmailForm);
router.get('/forgot-password', authController.isLoggedIn, viewController.getForgotPasswordForm);
router.get('/reset-password/:token', authController.isLoggedIn, viewController.getResetPasswordForm);

router.get('/me', authController.authenticateUser, viewController.getAccount);

export default router;
