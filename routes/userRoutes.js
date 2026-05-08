import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/verifyEmail', authController.verifyEmail);
router.post('/resendEmailVerification', authController.resendEmailVerification);
router.patch('/resetPassword/:token', authController.resetPassword);

// Need to confirm the email
router.post('/forgotPassword', authController.forgotPassword);
router.post('/login', authController.login);

router.patch(
    '/updatePassword',
    authController.authenticateUser,
    authController.updatePassword,
);

router
    .route('/me')
    .patch(authController.authenticateUser, userController.updateMe)
    .delete(authController.authenticateUser, userController.deleteMe);

router.route('/').get(userController.getAllUsers).post(userController.addUser);
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

export default router;
