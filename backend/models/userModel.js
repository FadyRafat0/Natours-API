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
        isVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationOtp: String,
        emailVerificationOtpExpires: Date,
        emailVerificationToken: String,
        photo: {
            type: String,
            default: 'default.jpg',
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

// if email is modified, reset the email confirmation status
userSchema.pre('save', async function () {
    if (!this.isModified('email')) return;
    if (this.isNew && this.isVerified === true) return;
    if (this.isModified('isVerified') && this.isVerified === true) return;
    
    this.isVerified = false;
});
userSchema.pre('findOneAndUpdate', function () {
    const update = this.getUpdate();

    const isEmailBeingUpdated =
        update.email || (update.$set && update.$set.email);
        
    const isVerifiedExplicit = update.isVerified !== undefined ? update.isVerified : (update.$set && update.$set.isVerified);

    if (isEmailBeingUpdated) {
        if (isVerifiedExplicit === false) {
            this.set({ isVerified: false });
        }
    }
});

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

// DOC FUNCTIONS:
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
userSchema.methods.createEmailVerificationToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    return resetToken;
};
userSchema.methods.createEmailOTP = function () {
    const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
    });

    this.emailVerificationOtp = crypto.createHash('sha256').update(otp).digest('hex');
    this.emailVerificationOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return otp;
};

const User = mongoose.model('User', userSchema);
export default User;
