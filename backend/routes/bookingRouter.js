import express from 'express';
import * as bookController from './../controllers/bookingController.js';
import * as authController from './../controllers/authController.js';

const router = express.Router();

router.use(authController.authenticateUser);
router.use(authController.restrictDemoAdmin);

router.get(
    '/checkout-session/:tourId',
    authController.authorizeRoles('user'),
    authController.checkEmailVerified,
    bookController.getCheckoutSession,
);

// Allow logged-in users to see their own bookings
router.get('/my-bookings', bookController.getMyBookings);

router.use(authController.authorizeRoles('admin'));

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
