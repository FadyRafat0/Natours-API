import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import otpGenerator from 'otp-generator';

// name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please tell us your name'],
        },
        email: {
            type: String,
            unique: [true, 'Email must be unique'],
            required: [true, 'Please tell us your email'],
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        isEmailConfirmed: {
            type: Boolean,
            default: false,
        },
        emailOTP: String,
        emailOTPExpiresIn: Date,
        photo: {
            type: String,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password!'],
            validate: [
                validator.isStrongPassword,
                'Please make a strong password',
            ],
            select: false, // to not show in the output
        },
        role: {
            type: String,
            enum: ['user', 'guide', 'lead-guide', 'admin'],
            default: 'user',
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm the password'],
            // This Only Works With SAVE on .create() .save()
            validate: {
                validator: function (val) {
                    return this.password === val;
                },
                message: 'Passwords are not the same',
            },
            select: false, // to not show in the output
        },
        passwordChangedAt: {
            type: Date,
            default: Date.now,
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

userSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'user',
    localField: '_id',
});

// Password
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.passwordChangedAt = Date.now() - 1000; // make sure JWT token be after the passwordChangedAt
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});

userSchema.methods.isCorrectPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    // JWTTimestamp is in seconds and passwordChangedAt is in milliseconds
    if (this.passwordChangedAt.getTime() > JWTTimestamp * 1000) {
        return true;
    }
    return false;
};
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};
userSchema.methods.createEmailOTP = function () {
    const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
    });

    this.emailOTP = crypto.createHash('sha256').update(otp).digest('hex');
    this.emailOTPExpiresIn = Date.now() + 10 * 60 * 1000; // 10 minutes
    return otp;
};

// OPTIONS: populateReviews
userSchema.pre(/^find/, function () {
    const options = this.getOptions() || {};

    if (options.populateReviews) {
        this.populate({
            path: 'reviews',
            select: 'tour review rating',
            options: { populateTour: true },
        });
    }
});

const User = mongoose.model('User', userSchema);
export default User;
