import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

// name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
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
    photo: {
        type: String, // url ?
    },
    password: {
        type: String,
        required: [true, 'Please provide a password!'],
        validate: [validator.isStrongPassword, 'Please make a strong password'],
        select: false, // to not show in the output
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
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});

userSchema.methods.isCorrectPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
export default User;
