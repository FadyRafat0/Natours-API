import express from 'express';
import rateLimit from 'express-rate-limit';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

const authLimiter = rateLimit({
    limit: 10,
    windowMs: 15 * 60 * 1000,
    message: 'Too many authentication attempts, please try again in 15 minutes',
    validate: { xForwardedForHeader: false, forwardedHeader: false }
});

router.post('/signup', authLimiter, authController.signup);
router.post('/login', authLimiter, authController.login);
// post not get to avoid pre-fetching by the browser problem
router.post('/logout', authController.logout);
router.post('/forgotPassword', authLimiter, authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.authenticateUser);

router.post('/sendVerificationOtp', authController.sendVerificationOtp);
router.post('/verifyEmailOtp', authController.verifyEmailOtp);
router.patch('/updatePassword', authController.updatePassword);

router
    .route('/me')
    .all(userController.setUserId)
    .get(userController.getUser)
    .patch(
        userController.uploadPhoto,
        userController.filterAllowedUpdates('name', 'email'),
        userController.resizePhoto,
        userController.updateMe,
    )
    .delete(userController.deleteUser);

// restriced only to admin
router.use(authController.authorizeRoles('admin'));

router.route('/').get(userController.getAllUsers);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUserImage, userController.deleteUser);

export default router;
