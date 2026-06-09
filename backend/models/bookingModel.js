import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Booking must belong to a tour!'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Booking must belong to a user!'],
        },
        price: {
            type: Number,
            required: [true, 'Booking must have a price!'],
        },
        paid: {
            type: Boolean,
            default: true,
        },
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
        timestamps: true,
    },
);

bookingSchema.pre(/^find/, function () {
    this.populate('tour').populate('user');
});

// Prevent duplicate bookings
bookingSchema.index({ tour: 1, user: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
