import express from 'express';
import * as tourController from '../controllers/tourController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// router.param('id', tourController.checkID);

router.route('/stats').get(tourController.getTourStats);

router
    .route('/top-5-expensive')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(authController.authenticateUser, tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(
        authController.authenticateUser,
        authController.authorizeRoles('admin', 'lead-guide'),
        tourController.deleteTour,
    );

export default router;
