import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

export const getAllUsers = async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        data: users,
    });
};
export const addUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'route handler is not implemented yet',
    });
};
export const getUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'route handler is not implemented yet',
    });
};
export const updateUser = catchAsync(async (req, res, next) => {
    // 1) Get user from database
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('No user found with that ID', 404));

    // 2) Update user fields
    Object.keys(req.body).forEach((key) => {
        user[key] = req.body[key];
    });

    // 3) Save (triggers pre-save hooks and validators)
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'user updated successfully',
        data: user,
    });
});
export const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: 'route handler is not implemented yet',
    });
};

export const updateMe = catchAsync(async (req, res, next) => {
    // Create error if user trying to update password
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates, Please use /updatePassword',
                400,
            ),
        );
    }

    // filer the object to just update the name, email, photo
    const filteredBody = filterObj(req.body, 'name', 'email', 'photo');

    // update user document
    const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        date: {
            user,
        },
    });
});

export const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.user.id);
    // we are logged in

    res.status(204).json({
        status: 'succes',
        data: null,
    });
});
