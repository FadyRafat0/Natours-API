import mongoose from 'mongoose';
import Tour from './tourModel.js';

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review can not be empty!'],
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: [1, 'Min rating is 1'],
            max: [5, 'Max rating is 5'],
            validate: {
                validator: Number.isInteger,
                message:
                    '{VALUE} is not an integer value. Please provide a whole number.',
            },
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to a tour.'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user.'],
        },
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    },
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// populate Tour, User
reviewSchema.pre(/^find/, function () {
    const options = this.getOptions();

    if (options.populateTour) {
        this.populate({
            path: 'tour',
            select: '_id name price duration difficulty',
        });
    }

    if (options.populateUser) {
        this.populate({
            path: 'user',
            select: '_id name photo email',
        });
    }
});

// this points to current model O(N) Way
reviewSchema.statics.calculateAveragaRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: '$tour',
                avgRatings: { $avg: '$rating' },
                nRatings: { $sum: 1 },
            },
        },
    ]);

    // when deleting and no remaining reviews
    if (stats.length === 0) {
        stats.push({
            avgRatings: 0,
            nRatings: 0,
        });
    }

    await Tour.findByIdAndUpdate(tourId, {
        ratingsAverage: stats[0].avgRatings,
        ratingsQuantity: stats[0].nRatings,
    });
};

reviewSchema.post('save', function () {
    this.constructor.calculateAveragaRatings(this.tour);
});
reviewSchema.post(/^findOneAnd/, async function (doc) {
    if (doc) {
        await doc.constructor.calculateAveragaRatings(doc.tour);
    }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
