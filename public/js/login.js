/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password,
            },
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/logout',
        });

        // Change location.reload(true) to redirect to the root page
        if (res.data.status === 'success') location.assign('/');
    } catch (err) {
        console.log(err.response);
        showAlert('error', 'Error logging out! Try again.');
    }
};

export const signup = async (name, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm,
            },
        });

        if (res.data.status === 'success') {
            showAlert(
                'success',
                res.data.message ||
                    'Successfully signed up! Please check your email to verify your account.',
            );
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const verifyEmail = async (token, otp) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `/api/v1/users/verifyEmail/${token}`,
            data: { otp },
        });

        if (res.data.status === 'success') {
            showAlert(
                'success',
                'Email verified successfully! You are now logged in.',
            );
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
export const resendVerifyEmail = async () => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/resendEmailVerification',
        });

        if (res.data.status === 'success') {
            showAlert(
                'success',
                res.data.message ||
                    'Verification email sent! Please check your inbox.',
            );
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
        throw err; // Re-throw so the caller can detect failure
    }
};
export const forgotPassword = async (email) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/forgotPassword',
            data: { email },
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Password reset link sent to your email.');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
export const resetPassword = async (password, passwordConfirm, token) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/users/resetPassword/${token}`,
            data: { password, passwordConfirm },
        });

        if (res.data.status === 'success') {
            showAlert(
                'success',
                'Password reset successfully! You are now logged in.',
            );
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
