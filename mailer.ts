export const sendNotificationEmail = async (to: string, subject: string, message: string) => {
  console.log(`[Mock Email] To: ${to} | Subject: ${subject}`);
  console.log(`[Mock Email] Body: ${message}`);
  return { success: true, message: 'Email sent successfully (mocked)' };
};
