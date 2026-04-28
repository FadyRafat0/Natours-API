import express from 'express';
import morgan from 'morgan';

import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import AppError from './utils/appError.js';
import errorHanlder from './controllers/errorController.js';

const dirname = import.meta.dirname;
const app = express();

app.set('query parser', 'extended'); // to automatically convert brackets in the URL into nested objects.

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // to see the request on terminal
}

app.use(express.json()); // to let us access req.body as object

// public folder become the root
app.use(express.static(`${dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all(/.*/, (req, res, next) => {
    next(new AppError(`Cannot access ${req.originalUrl} In This Server`, 404));
});

app.use(errorHanlder);

export default app;
