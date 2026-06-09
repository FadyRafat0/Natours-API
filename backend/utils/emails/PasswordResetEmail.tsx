import React from 'react';
import BaseEmail from './BaseEmail.js';

interface Props {
  firstName: string;
  url: string;
}

const PasswordResetEmail: React.FC<Props> = ({ firstName, url }) => {
  return (
    <BaseEmail subject="Your password reset token (valid for only 10 minutes)">
      <p>Hi {firstName},</p>
      <p>Forgot your password? Use the button below to choose a new one.</p>
      <table role="presentation" border={0} cellPadding={0} cellSpacing={0} className="btn btn-primary">
        <tbody>
          <tr>
            <td align="left">
              <table role="presentation" border={0} cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td> <a href={url} target="_blank" rel="noopener noreferrer">Reset your password</a> </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <p>If you didn't forget your password, please ignore this email.</p>
    </BaseEmail>
  );
};

export default PasswordResetEmail;
