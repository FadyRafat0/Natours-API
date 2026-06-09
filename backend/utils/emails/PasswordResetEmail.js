import baseEmail from './BaseEmail.js';

/**
 * Password reset email with a reset link.
 */
export default function passwordResetEmail(firstName, url) {
    const body = `
        <p>Hi ${firstName},</p>
        <p>Forgot your password? Use the button below to choose a new one.</p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
            <tbody>
                <tr>
                    <td align="left">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tbody>
                                <tr>
                                    <td><a href="${url}" target="_blank" rel="noopener noreferrer">Reset your password</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <p>If you didn't forget your password, please ignore this email.</p>`;

    return baseEmail('Your password reset token (valid for only 10 minutes)', body);
}
