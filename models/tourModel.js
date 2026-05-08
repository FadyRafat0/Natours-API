import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tour must have a name'],
            trim: true,
            unique: [true, 'Name cannot be duplicate'],
            minlength: [10, 'Name must be at least 10 charcters'],
            maxlength: [40, 'Name must be at most 40 charcters'],
            // validate: {
            //     validator: function (v) {
            //         return v.toLowerCase() != 'fuck you mother fucker';
            //     },
            //     message: 'BE KIND MAN !',
            // },
            validate: validator.isAscii,
        },
        nameSlug: {
            type: String,
            default: 'Just A Default Value',
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
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    },
);

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});
tourSchema.virtual('durationMonths').get(function () {
    return this.durationWeeks / 4;
});

// DOCUMENT MIDDLEWARE
// PRE is called before updating in DB
// .save() , .create() (not insertMany)
tourSchema.pre('save', async function () {
    this.nameSlug = slugify(this.name, { lower: true });
});

// POST is called after saving the doc in DB
// tourSchema.post('save', function (doc, next) {
//     console.log(`From POST 1`);
//     next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function () {
    this.find({ secretTour: { $ne: true } });
});

// AGGREGATON MIDDLEWARE
tourSchema.pre('aggregate', function () {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    // console.log(this.pipeline());
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
