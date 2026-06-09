import React from 'react';
import BaseEmail from './BaseEmail.js';

interface Props {
  firstName: string;
  url: string;
}

const WelcomeEmail: React.FC<Props> = ({ firstName, url }) => {
  return (
    <BaseEmail subject="Welcome to the Natours Family!">
      <p>Hi {firstName},</p>
      <p>Welcome to Natours, we're glad to have you 🎉🙏</p>
      <p>We're all a big family here, so make sure to upload your user photo so we get to know you a bit better!</p>
      <table role="presentation" border={0} cellPadding={0} cellSpacing={0} className="btn btn-primary">
        <tbody>
          <tr>
            <td align="left">
              <table role="presentation" border={0} cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td> <a href={url} target="_blank" rel="noopener noreferrer">Upload user photo</a> </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <p>If you need any help with booking your next tour, please don't hesitate to contact me!</p>
      <p>- Fady Rafat, CEO</p>
    </BaseEmail>
  );
};

export default WelcomeEmail;
