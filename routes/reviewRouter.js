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
        reviewController.setTourUserIds,
        reviewController.createReview,
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(
        authController.authorizeRoles('user', 'admin'),
        reviewController.checkIfAuthor,
        reviewController.updateReview,
    )
    .delete(
        authController.authorizeRoles('user', 'admin'),
        reviewController.checkIfAuthor,
        reviewController.deleteReview,
    );

export default router;
