import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import Tour from './../models/tourModel.js';
import User from './../models/userModel.js';
import Review from './../models/reviewModel.js';

const { dirname } = import.meta;

dotenv.config({ path: `${dirname}/../config.env` });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

mongoose
    .connect(DB)
    .then((con) => console.log('Connected To DB Successfully'))
    .catch((err) => console.log(`DB ERROR ${err}`));

const tours = JSON.parse(
    fs.readFileSync(`${dirname}/data/tours.json`, 'utf-8'),
);
const users = JSON.parse(
    fs.readFileSync(`${dirname}/data/users.json`, 'utf-8'),
);
const reviews = JSON.parse(
    fs.readFileSync(`${dirname}/data/reviews.json`, 'utf-8'),
);

// process.argv[2]

const importData = async () => {
    try {
        await Tour.create(tours);
        users.forEach((el) => {
            el.isEmailConfirmed = true;
        });
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);

        console.log('Imported Successfully');
    } catch (err) {
        console.log(err);
    }
};

const deleteOldData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Deleted Successfully');
    } catch (err) {
        console.log(err);
    }
};

const resetDatabase = async () => {
    await deleteOldData();
    await importData();

    process.exit();
};

resetDatabase();
