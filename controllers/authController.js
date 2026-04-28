import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

export const signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(user._id);

    res.status(201).json({
        status: 'sucess',
        token,
        data: user,
    });
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    console.log(email, password);

    // 1) check the email and password exist
    if (!email || !password) {
        return next(new AppError('Please Enter the email and password', 404));
    }

    // 2) check the user exist & password is right
    const user = await User.findOne({ email }).select('+password');
    console.log(user);
    if (!user || !(await user.isCorrectPassword(password, user.password))) {
        return next(new AppError('Wrong Email or password', 401));
    }

    const token = signToken(user._id);

    res.status(201).json({
        status: 'sucess',
        token,
        // data: user,
    });
});
