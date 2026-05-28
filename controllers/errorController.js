import AppError from './../utils/appError.js';

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = Object.values(err.keyValue)[0];
    const message = `Duplicate field value for ${field}: "${value}". Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);

const sendDevError = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }

    // RENDERED WEBSITE
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
    });
};

const sendProdError = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status, 
                message: err.message,
            });
        }

        // Programming Errors (Errors From The Code)
        console.error('ERROR 💥', err);
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }

    // RENDERED WEBSITE
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message,
        });
    }

    // Programming Errors (Don't leak details to client)
    console.error('ERROR 💥', err);
    return res.status(500).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.',
    });
};

// Global Express Error Middleware
export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendDevError(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let operationalError = err;

        if (err.name === 'CastError') operationalError = handleCastErrorDB(err);
        if (err.code === 11000) operationalError = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError')
            operationalError = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError')
            operationalError = handleJWTError();
        if (err.name === 'TokenExpiredError')
            operationalError = handleJWTExpiredError();

        // Send the final processed operational error
        sendProdError(operationalError, req, res);
    }
};
