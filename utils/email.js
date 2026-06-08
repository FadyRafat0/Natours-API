import nodemailer from 'nodemailer';
import pug from 'pug';
import * as htmlToText from 'html-to-text';

import { join } from 'path';
const { dirname } = import.meta;

class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `${process.env.EMAIL_FROM}`;
    }

    createTransport() {
        // In production, use SendGrid.
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.EMAIL_USERNAME_PROD,
                    pass: process.env.EMAIL_PASSWORD_PROD,
                },
            });
        }

        // In development, use Mailtrap.
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

    async send(template, subject, data = {}) {
        const templatePath = join(
            dirname,
            '..',
            'views',
            'emails',
            `${template}.pug`,
        );

        const html = pug.renderFile(templatePath, {
            firstName: this.firstName,
            subject,
            url: this.url,
            ...data,
        });

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
        // sending welcome email without awaiting to avoid delaying the signup response
        // not crutial to make an error if the email is not sent successfully
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
