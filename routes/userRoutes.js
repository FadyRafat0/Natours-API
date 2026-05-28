import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/verifyEmail', authController.verifyEmail);
router.post('/resendEmailVerification', authController.resendEmailVerification);
router.patch('/resetPassword/:token', authController.resetPassword);
router.post('/forgotPassword', authController.forgotPassword);

// post not get to avoid pre-fetching by the browser problem
router.post('/logout', authController.logout);

// Need to confirm the email
router.post('/login', authController.login);

router.use(authController.authenticateUser);

router.patch('/updatePassword', authController.updatePassword);

router
    .route('/me')
    .all(userController.setUserId)
    .get(userController.getUser)
    .patch(userController.updateCheck, userController.updateUser)
    .delete(userController.deleteUser);

// restriced only to admin
router.use(authController.authorizeRoles('admin'));

router.route('/').get(userController.getAllUsers);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

export default router;
