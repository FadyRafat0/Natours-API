import express from 'express';
import * as reviewController from './../controllers/reviewController.js';
import * as authController from './../controllers/authController.js';

// when tour called us we need tourId
const router = express.Router({ mergeParams: true });

router.use(authController.authenticateUser);

router
    .route('/')
    .get(reviewController.setFilterTourId, reviewController.getAllReviews)
    .post(
        authController.authorizeRoles('user'),
        authController.checkEmailVerified,
        reviewController.setTourUserIds,
        reviewController.createReview,
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .all(
        authController.authorizeRoles('user', 'admin'),
        authController.checkEmailVerified,
        reviewController.checkIfAuthor,
    )
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

export default router;
