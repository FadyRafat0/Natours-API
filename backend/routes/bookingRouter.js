import express from 'express';
import * as bookController from './../controllers/bookingController.js';
import * as authController from './../controllers/authController.js';

// when tour called us we need tourId
const router = express.Router();

router.use(authController.authenticateUser);

router.get(
    '/checkout-session/:tourId',
    authController.checkEmailVerified,
    bookController.getCheckoutSession,
);

router.use(authController.authorizeRoles('admin', 'lead-guide'));

router
    .route('/')
    .get(bookController.getAllBookings)
    .post(bookController.createBooking);

router
    .route('/:id')
    .get(bookController.getBooking)
    .patch(bookController.updateBooking)
    .delete(bookController.deleteBooking);

export default router;
