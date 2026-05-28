import express from 'express';
import multer from 'multer';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const upload = multer({ dest: '/public/img/users' });

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
// post not get to avoid pre-fetching by the browser problem
router.post('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.post('/verifyEmail/:token', authController.verifyEmail);

router.use(authController.authenticateUser);

// Iam Logged In but I want to resend the OTP for email verification
router.post('/resendEmailVerification', authController.resendEmailVerification);

router.patch('/updatePassword', authController.updatePassword);

router
    .route('/me')
    .all(userController.setUserId)
    .get(userController.getUser)
    .patch(
        userController.updateCheck,
        upload.single('photo'),
        userController.updateUser,
    )
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
