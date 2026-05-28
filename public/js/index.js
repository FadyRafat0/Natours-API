/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout, signup, verifyEmail, resendVerifyEmail, forgotPassword, resetPassword } from './login';
import { updateSettings } from './updateSettings';
import { showAlert } from './alerts';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const signupForm = document.querySelector('.form--signup');
const verifyEmailForm = document.querySelector('.form--verify-email');
const resendOtpBtn = document.querySelector('.resend-btn');
const forgotPasswordForm = document.querySelector('.form--forgot-password');
const resetPasswordForm = document.querySelector('.form--reset-password');

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (logOutBtn) {
    logOutBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // <-- Add this line if it's missing!
        await logout();
    });
}

if (userDataForm) {
    userDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateSettings({ name, email }, 'data');
    });
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent =
            'Updating...';

        const passwordCurrent =
            document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm =
            document.getElementById('password-confirm').value;
        await updateSettings(
            { passwordCurrent, password, passwordConfirm },
            'password',
        );

        document.querySelector('.btn--save-password').textContent =
            'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        signup(name, email, password, passwordConfirm);
    });
}

if (verifyEmailForm) {
    verifyEmailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const otp = document.getElementById('otp').value;
        verifyEmail(email, otp);
    });
}

if (resendOtpBtn) {
    resendOtpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        if (!email) return showAlert('error', 'Please provide an email address');
        resendVerifyEmail(email);
    });
}

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        forgotPassword(email);
    });
}

if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const token = document.getElementById('token').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        resetPassword(password, passwordConfirm, token);
    });
}
