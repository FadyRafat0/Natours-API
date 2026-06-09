/**
 * Base email layout wrapper.
 * Returns a full HTML document string with consistent styling for all emails.
 */
export default function baseEmail(subject, bodyContent) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${subject}</title>
    <style>
        body { font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f6f6f6; }
        table { border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; }
        table td { font-family: sans-serif; font-size: 14px; vertical-align: top; }
        .container { display: block; margin: 0 auto !important; max-width: 580px; padding: 10px; width: 580px; }
        .content { box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px; }
        .main { background: #ffffff; border-radius: 3px; width: 100%; }
        .wrapper { box-sizing: border-box; padding: 20px; }
        .content-block { padding-bottom: 10px; padding-top: 10px; }
        .footer { clear: both; margin-top: 10px; text-align: center; width: 100%; }
        .footer td, .footer p, .footer span, .footer a { color: #999999; font-size: 12px; text-align: center; }
        p { font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px; }
        a { color: #3498db; text-decoration: underline; }
        .btn { box-sizing: border-box; width: 100%; }
        .btn > tbody > tr > td { padding-bottom: 15px; }
        .btn table { width: auto; }
        .btn table td { background-color: #ffffff; border-radius: 5px; text-align: center; }
        .btn a { background-color: #ffffff; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; color: #3498db; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; }
        .btn-primary table td { background-color: #55c57a; }
        .btn-primary a { background-color: #55c57a; border-color: #55c57a; color: #ffffff; }
    </style>
</head>
<body>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
        <tbody>
            <tr>
                <td>&nbsp;</td>
                <td class="container">
                    <div class="content">
                        <table role="presentation" class="main">
                            <tbody>
                                <tr>
                                    <td class="wrapper">
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tbody>
                                                <tr>
                                                    <td>${bodyContent}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="footer">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                        <td class="content-block">
                                            <span class="apple-link">Natours Inc, 123 Nowhere Road, San Francisco CA 99999</span>
                                            <br /> Don't like these emails? <a href="#">Unsubscribe</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </td>
                <td>&nbsp;</td>
            </tr>
        </tbody>
    </table>
</body>
</html>`;
}
