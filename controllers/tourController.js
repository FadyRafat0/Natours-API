import Tour from './../models/tourModel.js';
import catchAsync from './../utils/catchAsync.js';
import * as factoryHandler from './factoryHandler.js';
import AppError from './../utils/appError.js';

// req.query is immutable
export const aliasTopTours = (req, res, next) => {
    const modifiedQuery = { ...req.query };
    modifiedQuery.limit = '5';
    modifiedQuery.sort = '-price,-ratingsAverage';
    modifiedQuery.fields = 'name,ratingsAverage,price,duration,maxGroupSize';

    Object.defineProperty(req, 'query', {
        value: modifiedQuery,
        writable: true,
        configurable: true,
        enumerable: true,
    });

    next();
};

export const getAllTours = factoryHandler.getAll(Tour, {
    populateGuides: true,
});
export const getTour = factoryHandler.getOne(
    Tour,
    { populateGuides: true },
    { path: 'reviews', options: { populateUser: true } },
);
export const createTour = factoryHandler.createOne(Tour);
export const updateTour = factoryHandler.updateOne(Tour);
export const deleteTour = factoryHandler.deleteOne(Tour);

export const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { difficulty: { $toUpper: '$difficulty' } },
                avgRatings: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                count: 1,
            },
        },
        {
            $limit: 3,
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: stats,
    });
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${year + 1}-01-01`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTours: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: {
                month: '$_id',
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: {
                numTours: -1,
            },
        },
        {
            $limit: 6,
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: plan,
    });
});

// '/tours-within-miles/:distance/center/:latlng',
export const getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng } = req.params;
    const [lat, lng] = latlng.split(',');

    if (!lat || !lng) {
        return next(
            new AppError(
                'Please provide latitutr and longitude in the format lat,lng.',
                400,
            ),
        );
    }

    const radius = distance / 3963.2;

    const tours = await Tour.find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius],
            },
        },
    });

    // console.log(distance, lat, lng);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: tours,
    });
});

// '/distances/:latlng'
export const getDistances = catchAsync(async (req, res, next) => {
    const { latlng } = req.params;
    const [lat, lng] = latlng.split(',');

    if (!lat || !lng) {
        return next(
            new AppError(
                'Please provide latitutr and longitude in the format lat,lng.',
                400,
            ),
        );
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1.0, lat * 1.0],
                },
                distanceField: 'distance',
                distanceMultiplier: 0.000621371,
            },
        },
        {
            $project: {
                distance: 1,
                name: 1,
            },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: distances,
    });
});
