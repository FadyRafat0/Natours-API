import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';

import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRouter.js';
import bookingRouter from './routes/bookingRouter.js';
import AppError from './utils/appError.js';
import errorHanlder from './controllers/errorController.js';

// eslint-disable-next-line prefer-destructuring
const dirname = import.meta.dirname;
const app = express();

// Implement CORS — allow any localhost port (Vite may use 5173, 5174, etc.)
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (Postman, curl) or any localhost origin, plus the production frontend URL
            const allowedOrigins = [/^http:\/\/localhost(:\d+)?$/];
            if (process.env.FRONTEND_URL) {
                allowedOrigins.push(new RegExp(`^${process.env.FRONTEND_URL}$`));
            }

            if (!origin || allowedOrigins.some((regex) => regex.test(origin))) {
                callback(null, true);
            } else {
                callback(new Error(`CORS blocked: ${origin}`));
            }
        },
        credentials: true,
    }),
);

// Set security HTTP headers with relaxed CSP for required external assets
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", 'https://js.stripe.com', "'unsafe-eval'"],
                styleSrc: [
                    "'self'",
                    'https://fonts.googleapis.com',
                    'https://unpkg.com',
                    "'unsafe-inline'",
                ],
                connectSrc: [
                    "'self'",
                    'ws://127.0.0.1:*',
                    'http://127.0.0.1:*',
                    'https://api.stripe.com',
                    'https://checkout.stripe.com',
                ],
                frameSrc: [
                    "'self'",
                    'https://js.stripe.com',
                    'https://checkout.stripe.com',
                    'https://hooks.stripe.com',
                ],
                imgSrc: [
                    "'self'",
                    'data:',
                    'blob:',
                    'https://*.tile.openstreetmap.org',
                    'https://*.stripe.com',
                ],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            },
        },
    }),
);

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
app.use(express.json());
app.use(cookieParser());

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

// Compress all responses
app.use(compression());

// Test Middleware
app.use((req, res, next) => {
    req.requestTime = new Date();
    next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all(/.*/, (req, res, next) => {
    next(new AppError(`Cannot access ${req.originalUrl} In This Server`, 404));
});

app.use(errorHanlder);

export default app;
