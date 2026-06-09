import React from 'react';
import BaseEmail from './BaseEmail.js';

interface Props {
  firstName: string;
  url: string;
  otp: string;
}

const EmailVerification: React.FC<Props> = ({ firstName, otp }) => {
  return (
    <BaseEmail subject="Please verify your email address">
      <p>Hi {firstName},</p>
      <p>To verify your email, please enter the one-time passcode below on the verification page.</p>
      
      <table role="presentation" border={0} cellPadding={0} cellSpacing={0}>
        <tbody>
          <tr>
            <td>
              <div className="content-block align-center">
                <table role="presentation" border={0} cellPadding={0} cellSpacing={0} align="center">
                  <tbody>
                    <tr>
                      <td style={{ background: '#f6f6f6', borderRadius: '8px', padding: '14px 22px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>OTP</p>
                        <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: 700, color: '#333', letterSpacing: '4px' }}>{otp}</p>
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
      <p>- Fady Rafat, CEO</p>
    </BaseEmail>
  );
};

export default EmailVerification;
