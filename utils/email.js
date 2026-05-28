import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    let transporter;

    if (process.env.NODE_ENV === 'production') {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST_PROD,
            port: process.env.EMAIL_PORT_PROD,
            auth: {
                user: process.env.EMAIL_USERNAME_PROD,
                pass: process.env.EMAIL_PASSWORD_PROD,
            },
        });
    } else {
        // Development: Use Mailtrap
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    // Define the email options
    const mailOptions = {
        from: 'Fady Rafat <fadyg6848@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;
