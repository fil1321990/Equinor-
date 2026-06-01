export async function sendNotificationEmail(to: string, subject: string, message: string) {
  console.log(`Sending email to ${to}: ${subject} - ${message}`);
  return true;
}
