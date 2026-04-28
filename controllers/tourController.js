import Tour from './../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// req.query is immutable
export const aliasTopTours = (req, res, next) => {
    const modifiedQuery = { ...req.query };
    modifiedQuery.limit = '5';
    modifiedQuery.sort = '-ratingsAverage,-price';
    modifiedQuery.fields = 'name,ratingsAverage,price,duration,maxGroupSize';

    Object.defineProperty(req, 'query', {
        value: modifiedQuery,
        writable: true,
        configurable: true,
        enumerable: true,
    });

    next();
};

export const getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // EXCECUTE QUERY
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: tours.length,
        timeToRespond: Date.now() - req.requestTime,
        data: tours,
    });
});

export const getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);

    if (!tour) return next(new AppError('No Tour With This ID', 404));

    res.status(200).json({
        status: 'success',
        body: tour,
    });
});
export const createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: newTour,
    });
});
export const updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!tour) return next(new AppError('No Tour With This ID', 404));

    res.status(200).json({
        status: 'success',
        body: tour,
    });
});
export const deleteTour = catchAsync(async (req, res) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) return next(new AppError('No Tour With This ID', 404));

    // 204 -> no content
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
export const getTourStats = catchAsync(async (req, res) => {
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

export const getMonthlyPlan = catchAsync(async (req, res) => {
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
