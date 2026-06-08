import multer from 'multer';
import sharp from 'sharp';

import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { removeUserPhoto } from './../utils/removeFiles.js';
import * as factoryHandler from './factoryHandler.js';

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     },
// });
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

export const uploadPhoto = upload.single('photo');
export const resizePhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    req.body.photo = req.file.filename;
    next();
});

// pick only elements in allowedFields from obj
export const pickFields = (obj, allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

// set the id in params as we logged in
export const setUserId = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

// check in (updateMe) the user wont change the password
export const filterAllowedUpdates = (...allowedFields) => {
    return async (req, res, next) => {
        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key) === false)
                return next(
                    new AppError(`This route is not for ${key} updates.`, 400),
                );
        });

        const filteredBody = pickFields(req.body, allowedFields);
        req.body = filteredBody;

        next();
    };
};

export const getUser = factoryHandler.getOne(
    User,
    {},
    // populate reviews of the user and tour of the review
    {
        path: 'reviews',
        options: { populateTour: true },
    },
);

export const getAllUsers = factoryHandler.getAll(User);

// DO NOT change password with this !
export const updateUser = factoryHandler.updateOne(User);
export const deleteUser = factoryHandler.deleteOne(User);

export const updateMe = catchAsync(async (req, res, next) => {
    try {
        const oldUserPhoto = req.user.photo;
        const user = await User.findById(req.user.id);

        Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));

        // to let the isEmailConfirmed pre hook run
        await user.save();

        // SUCCESS: If they uploaded a new photo, delete the old one (unless it's the default)
        if (req.file && oldUserPhoto !== 'default.jpg') {
            removeUserPhoto(oldUserPhoto);
        }

        res.status(200).json({ status: 'success', data: user });
    } catch (err) {
        // ERROR: The DB update failed! Delete the NEW photo that sharp just saved
        if (req.file) {
            removeUserPhoto(req.body.photo);
        }

        return next(err);
    }
});
