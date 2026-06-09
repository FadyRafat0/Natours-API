import baseEmail from './BaseEmail.js';

/**
 * Email verification with OTP code.
 */
export default function emailVerification(firstName, otp) {
    const body = `
        <p>Hi ${firstName},</p>
        <p>To verify your email, please enter the one-time passcode below on the verification page.</p>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tbody>
                <tr>
                    <td>
                        <div class="content-block" style="text-align: center;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                                <tbody>
                                    <tr>
                                        <td style="background: #f6f6f6; border-radius: 8px; padding: 14px 22px; text-align: center;">
                                            <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">OTP</p>
                                            <p style="margin: 6px 0 0; font-size: 22px; font-weight: 700; color: #333; letter-spacing: 4px;">${otp}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <p>If you need any help with booking your next tour, please don't hesitate to contact me!</p>
        <p>- Fady Rafat, CEO</p>`;

    return baseEmail('Please verify your email address', body);
}
