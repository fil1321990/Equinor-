import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || '587');
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || 'noreply@example.com';

let transporter: nodemailer.Transporter | null = null;

if (host && user && pass) {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export const sendNotificationEmail = async (to: string, subject: string, message: string) => {
  try {
    if (!transporter) {
      console.log(`[Mock Email] To: ${to} | Subject: ${subject}`);
      console.log(`[Mock Email] Body: ${message}`);
      return { success: true, message: 'Email sent successfully (mocked)' };
    }

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '<br/>')}</p>`,
    });

    console.log(`Message sent: ${info.messageId}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    console.log(`[Fallback Mock Email] To: ${to} | Subject: ${subject}`);
    console.log(`[Fallback Mock Email] Body: ${message}`);
    return { success: true, message: 'Email sent successfully (mocked fallback)' };
  }
};
