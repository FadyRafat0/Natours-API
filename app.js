import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRouter.js';
import AppError from './utils/appError.js';
import errorHanlder from './controllers/errorController.js';

// eslint-disable-next-line prefer-destructuring
const dirname = import.meta.dirname;
const app = express();

// Set security HTTP headers
app.use(helmet());

// to convert brackets in the URL into nested objects.
app.set('query parser', 'extended');

// Developement logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // to see the request on terminal
}

// limit requests from same IP
const limiter = rateLimit({
    limit: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests, try again in 1 hour',
});
app.use('/api', limiter);

// Body parser, reading data from body to req.body
app.use(express.json({ limit: '10kb' }));

// Make req.query writable again so the sanitizer doesn't crash
app.use((req, res, next) => {
    Object.defineProperty(req, 'query', {
        value: { ...req.query },
        writable: true,
        configurable: true,
        enumerable: true,
    });
    next();
});

// Data sanitization against NoSQL query injection (email: { $gt: {} })
app.use(mongoSanitize());

// Data sanitization against XSS (Html, JS code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Serving static files, public folder become the root
app.use(express.static(`${dirname}/public`));

// Test Middleware
app.use((req, res, next) => {
    req.requestTime = new Date();
    next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all(/.*/, (req, res, next) => {
    next(new AppError(`Cannot access ${req.originalUrl} In This Server`, 404));
});

app.use(errorHanlder);

export default app;
