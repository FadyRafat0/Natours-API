import nodemailer from 'nodemailer';
import * as htmlToText from 'html-to-text';

import welcomeEmail from './emails/WelcomeEmail.js';
import passwordResetEmail from './emails/PasswordResetEmail.js';
import emailVerification from './emails/EmailVerification.js';

class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `${process.env.EMAIL_FROM}`;
    }

    createTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.EMAIL_USERNAME_PROD,
                    pass: process.env.EMAIL_PASSWORD_PROD,
                },
            });
        }

        if (process.env.NODE_ENV === 'development') {
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST_DEV,
                port: process.env.EMAIL_PORT_DEV,
                auth: {
                    user: process.env.EMAIL_USER_DEV,
                    pass: process.env.EMAIL_PASSWORD_DEV,
                },
            });
        }
    }

    async send(templateName, subject, data = {}) {
        let html;
        if (templateName === 'welcome') {
            html = welcomeEmail(this.firstName, this.url);
        } else if (templateName === 'passwordReset') {
            html = passwordResetEmail(this.firstName, this.url);
        } else if (templateName === 'emailVerification') {
            html = emailVerification(this.firstName, data.otp);
        } else {
            throw new Error('Email template not found!');
        }

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html),
        };

        await this.createTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        this.send('welcome', 'Welcome to the Natours Family!').catch((err) => {
            console.error('Error sending welcome email:', err);
        });
    }

    async sendEmailVerification(otp) {
        await this.send(
            'emailVerification',
            'Please verify your email address',
            { otp },
        );
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)',
        );
    }
}

export default Email;
