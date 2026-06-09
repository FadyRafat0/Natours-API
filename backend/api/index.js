import mongoose from 'mongoose';
import app from '../app.js';
import '../init.js';

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

// In a serverless environment, we must cache the database connection
// to prevent exhausting connection limits across function invocations.
if (mongoose.connection.readyState === 0) {
    mongoose
        .connect(DB)
        .then(() => console.log('DB connection successful!'))
        .catch((err) => console.log('DB Error:', err));
}

export default app;
