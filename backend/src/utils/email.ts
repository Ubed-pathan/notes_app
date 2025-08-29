import nodemailer from 'nodemailer';

export async function sendOtpEmail(to: string, code: string) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  let transporter;
  if (host && port && user && pass) {
    transporter = nodemailer.createTransport({ host, port, auth: { user, pass } });
  } else {
    // Fallback to Ethereal for dev
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }

  const info = await transporter.sendMail({
    from: 'no-reply@noteapp.local',
    to,
    subject: 'Your OTP Code',
    text: `Your OTP is ${code}. It will expire in 10 minutes.`,
  });

  // For dev: log preview URL if using Ethereal
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log('OTP preview URL:', preview);
}
