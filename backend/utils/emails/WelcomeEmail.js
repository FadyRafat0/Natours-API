import baseEmail from './BaseEmail.js';

/**
 * Welcome email sent after user signup.
 */
export default function welcomeEmail(firstName, url) {
    const body = `
        <p>Hi ${firstName},</p>
        <p>Welcome to Natours, we're glad to have you 🎉🙏</p>
        <p>We're all a big family here, so make sure to upload your user photo so we get to know you a bit better!</p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
                <tr>
                    <td align="left">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tbody>
                                <tr>
                                    <td><a href="${url}" target="_blank" rel="noopener noreferrer">Upload user photo</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <p>If you need any help with booking your next tour, please don't hesitate to contact me!</p>
        <p>- Fady Rafat, CEO</p>`;

    return baseEmail('Welcome to the Natours Family!', body);
}
