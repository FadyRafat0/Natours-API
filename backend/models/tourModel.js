import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';

const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
    },
    coordinates: [Number], // Expects an array of numbers [longitude, latitude]
    address: String,
    description: String,
    day: Number,
});

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tour must have a name'],
            trim: true,
            unique: [true, 'Name cannot be duplicate'],
            minlength: [10, 'Name must be at least 10 charcters'],
            maxlength: [40, 'Name must be at most 40 charcters'],
            validate: validator.isAscii,
        },
        nameSlug: {
            type: String,
            default: 'no-name',
        },
        price: {
            type: Number,
            required: [true, 'Tour must have a price'],
        },
        priceDiscount: {
            type: Number,
        },
        duration: {
            type: Number,
            required: [true, 'Tour must have a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'Tour must have a max group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'Tour must have a difficulty'],
            trim: true,
            lowercase: true,
            enum: {
                values: ['easy', 'medium', 'hard'],
                message: 'Difficulty must be one of: easy, medium and hard',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 0,
            min: [1.0, 'Min rating must be at least 1.0'],
            max: [5.0, 'Max rating must be at most 5.0'],
            // run each time we set a value on it
            set: (val) => Math.round(val * 10) / 10.0,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'Tour must have a summary'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'Tour must have an image'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
        startLocation: locationSchema,
        locations: [locationSchema],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User', // Model name
            },
        ],
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    },
);

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
});

tourSchema.index({ ratingsAverage: 1 });
// it will speed the queries for price, price&ratingsAverage
tourSchema.index({ price: 1, ratingsAverage: 1 });
tourSchema.index({ nameSlug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// .save() , .create() (not insertMany)
tourSchema.pre('save', async function () {
    this.nameSlug = slugify(this.name, { lower: true });
});

// OPTIONS: populateGuides | populateReviews
tourSchema.pre(/^find/, function () {
    const options = this.getOptions() || {};
    if (options.populateGuides) {
        this.populate({
            path: 'guides',
            select: '-__v -passwordChangedAt',
        });
    }

    if (options.populateReviews) {
        this.populate({
            path: 'reviews',
            select: 'review rating user',
            options: { populateUser: true },
        });
    }
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
