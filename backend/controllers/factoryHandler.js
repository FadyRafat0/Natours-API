import catchAsync from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import APIFeatures from './../utils/apiFeatures.js';

// options for population in reviews Model
export const getOne = (Model, options = {}, populateOptions = undefined) =>
    catchAsync(async (req, res, next) => {
        const query = Model.findById(req.params.id).setOptions(options);

        if (populateOptions) query.populate(populateOptions);

        const document = await query;

        if (!document)
            return next(
                new AppError(
                    `No ${Model.modelName.toLowerCase()} With This ID`,
                    404,
                ),
            );

        res.status(200).json({
            status: 'success',
            data: document,
        });
    });

export const getAll = (Model, options = {}, populateOptions = undefined) =>
    catchAsync(async (req, res, next) => {
        let filter = {};
        if (req.filterObj) filter = req.filterObj;

        const featuresForTotal = new APIFeatures(Model.find(filter), req.query).filter();
        const totalDocuments = await featuresForTotal.query.countDocuments();

        const query = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        if (populateOptions) query.populate(populateOptions);

        const documents = await query.query.setOptions(options);

        res.status(200).json({
            status: 'success',
            results: documents.length,
            totalResults: totalDocuments,
            timeToRespond: Date.now() - req.requestTime,
            data: documents,
        });
    });

export const createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const newDocument = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: newDocument,
        });
    });

export const updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: 'after',
                runValidators: true,
            },
        );

        if (!document)
            return next(
                new AppError(
                    `No ${Model.modelName.toLowerCase()} With This ID`,
                    404,
                ),
            );

        res.status(200).json({ status: 'success', data: document });
    });

export const deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const document = await Model.findByIdAndDelete(req.params.id);

        if (!document)
            return next(
                new AppError(
                    `No ${Model.modelName.toLowerCase()} With This ID`,
                    404,
                ),
            );

        // 204 -> no content
        res.status(200).json({
            status: 'success',
            data: null,
        });
    });
