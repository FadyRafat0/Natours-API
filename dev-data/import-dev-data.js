import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import Tour from './../models/tourModel.js';

const dirname = import.meta.dirname;

dotenv.config({ path: `${dirname}/../../../config.env` });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

mongoose
    .connect(DB)
    .then((con) => console.log('Connected To DB Successfully'))
    .catch((err) => console.log(`DB ERROR ${err}`));

const tours = JSON.parse(
    fs.readFileSync(`${dirname}/data/tours-simple.json`, 'utf-8'),
);

// process.argv[2]

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Imported Successfully');
    } catch (err) {
        console.log(err);
    }
};

const deleteOldData = async () => {
    try {
        await Tour.deleteMany();
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
