import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import * as factoryHandler from './factoryHandler.js';

export const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

export const getUser = factoryHandler.getOne(
    User,
    {},
    {
        path: 'reviews',
        options: { populateTour: true },
    },
);
export const getAllUsers = factoryHandler.getAll(User);
// DO NOT change password or email with this !
export const updateUser = factoryHandler.updateOne(User);
export const deleteUser = factoryHandler.deleteOne(User);

// we are logged in
export const setUserId = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
export const updateCheck = (req, res, next) => {
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
    req.body = filteredBody;

    // console.log(req.body);
    next();
};
