import mongoose from 'mongoose';
import app from '../app.js';
import '../init.js';

// Safely handle DB connection string if environment variables are not yet set
let DB = '';
if (process.env.DATABASE && process.env.DATABASE_PASSWORD) {
    DB = process.env.DATABASE.replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD,
    );
}

// In a serverless environment, we must cache the database connection
// to prevent exhausting connection limits across function invocations.
if (DB && mongoose.connection.readyState === 0) {
    mongoose
        .connect(DB)
        .then(() => console.log('DB connection successful!'))
        .catch((err) => console.log('DB Error:', err));
}

export default app;
