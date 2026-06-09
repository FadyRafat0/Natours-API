import multer from 'multer';
import sharp from 'sharp';

import Tour from './../models/tourModel.js';
import catchAsync from './../utils/catchAsync.js';
import * as factoryHandler from './factoryHandler.js';
import AppError from './../utils/appError.js';
import User from '../models/userModel.js';
import { removeTourPhoto } from '../utils/removeFiles.js';

const multerStorage = multer.memoryStorage();
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError('Not an image! Please upload only images.', 400),
            false,
        );
    }
};

export const upload = multer({
    storage: multerStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB
    },
});

// upload.single('name') req.file
// upload.array('name', count) req.files
export const uploadImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 },
]);

export const resizeImages = catchAsync(async (req, res, next) => {
    if (req.files.imageCover) {
        req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${req.body.imageCover}`);
    }

    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (file, index) => {
                const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;

                await sharp(file.buffer)
                    .resize(2000, 1333)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(`public/img/tours/${filename}`);

                req.body.images.push(filename);
            }),
        );
    }

    next();
});

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

export const getAllTours = factoryHandler.getAll(
    Tour,
    { populateGuides: true, populateReviews: true }
);
export const getTour = factoryHandler.getOne(
    Tour,
    { populateGuides: true, populateReviews: true }
);
export const createTour = factoryHandler.createOne(Tour);
export const updateTour = factoryHandler.updateOne(Tour);

// delete Tour Images from the file system when deleting the tour
export const deleteImages = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return next(new AppError('No tour found with that ID', 404));

    if (tour.imageCover) removeTourPhoto(tour.imageCover);
    if (tour.images) tour.images.forEach((image) => removeTourPhoto(image));

    next();
});
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
