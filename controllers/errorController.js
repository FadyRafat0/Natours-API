import AppError from './../utils/appError.js';

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    // const value = err.errmsg.match(/".*"/); // can match with RegExp
    const message = `Duplicate field value: ${err.keyValue.name}. Please use another value`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    return new AppError(err.message, 400);
};
const sendDevError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};
const sendProdError = (err, res) => {
    // Normal Errors I Threw (Invalid ID ... )
    if (err.isOperational) {
        res.status(err.statusCode).json({
            stauts: err.status,
            message: err.message,
        });
    }
    // Programming Errors (Errors From The Code)
    else {
        // 1) Log error
        console.error(`Error ${err}`);

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Some thing went very wrong!',
        });
    }
};

// if any error happens in express middleware
export default (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendDevError(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        // console.log(error);
        console.log(error);
        if (err.name === 'CastError') error = handleCastErrorDB(err);
        if (err.code === 11000) error = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(err);

        sendProdError(error, res);
    } else {
        res.status(404).json({
            status: 'fail',
            message: 'Fuck You',
        });
    }
};
