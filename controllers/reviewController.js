import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import Review from './../models/reviewModel.js';
import * as factoryHandler from './factoryHandler.js';

export const setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

export const setFilterTourId = (req, res, next) => {
    if (req.params.tourId) req.filterObj = { tour: req.params.tourId };
    next();
};
export const checkIfAuthor = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) return next(new AppError('Ne Review With This ID', 404));

    // console.log(req.user._id.equals(review.user));

    const isAuthor = req.user._id.equals(review.user);
    if (req.user.role === 'user' && !isAuthor) {
        return next(
            new AppError("You cannot edit someone's else review.", 403),
        );
    }
    next();
});

export const getAllReviews = factoryHandler.getAll(Review, {
    populateTour: true,
    populateUser: true,
});
export const getReview = factoryHandler.getOne(Review, {
    populateTour: true,
    populateUser: true,
});
export const createReview = factoryHandler.createOne(Review);
export const updateReview = factoryHandler.updateOne(Review);
export const deleteReview = factoryHandler.deleteOne(Review);
