import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.route('/').get(userController.getAllUsers).post(userController.addUser);
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

export default router;
