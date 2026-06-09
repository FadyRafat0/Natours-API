import './init.js';
import mongoose from 'mongoose';
import app from './app.js';

const port = +process.env.PORT || 2525;

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

mongoose
    .connect(DB)
    .then(() => {
        console.log('DB connection successful!');
    })
    .catch((err) => {
        console.log(err);
    });

const server = app.listen(port, (err) => {
    if (err) return console.log(err);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection 🤡, Server Is Shutting Down ...');
    server.close(() => {
        process.exit(1);
    });
});
