import express from 'express';
import * as tourController from '../controllers/tourController.js';
import * as authController from '../controllers/authController.js';
import reviewRouter from '../routes/reviewRouter.js';

const router = express.Router();

router.route('/stats').get(tourController.getTourStats);

router
    .route('/top-5-expensive')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router
    .route('/monthly-plan/:year')
    .get(
        authController.authenticateUser,
        authController.authorizeRoles('admin', 'lead-guide', 'guide'),
        tourController.getMonthlyPlan,
    );

router.get(
    '/tours-within-miles/:distance/center/:latlng',
    tourController.getToursWithin,
);
router.get('/distances/:latlng', tourController.getDistances);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.authenticateUser,
        authController.authorizeRoles('admin', 'lead-guide'),
        authController.restrictDemoAdmin,
        tourController.uploadImages,
        tourController.resizeImages,
        authController.restrictDemoAdmin,
        tourController.createTour,
    );

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.authenticateUser,
        authController.restrictDemoAdmin,
        authController.authorizeRoles('admin', 'lead-guide'),
        tourController.uploadImages,
        tourController.resizeImages,
        tourController.updateTour,
    )
    .delete(
        authController.authenticateUser,
        authController.restrictDemoAdmin,
        authController.authorizeRoles('admin', 'lead-guide'),
        tourController.deleteImages,
        tourController.deleteTour,
    );

router.use('/:tourId/reviews', reviewRouter);

export default router;
