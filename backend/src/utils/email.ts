import nodemailer from 'nodemailer';

export async function sendOtpEmail(to: string, code: string) {
  const appName = process.env.APP_NAME || 'HD Note App';
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@noteapp.local';

  if (!process.env.MAIL_FROM) {
    console.warn('MAIL_FROM not set. Using:', from);
  }

  let transporter;
  if (host && port && user && pass) {
    // secure true for 465, false for 587 (STARTTLS)
    const secure = port === 465;
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
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

  await transporter.sendMail({
    from,
    to,
    subject: `${appName} - Your OTP Code`,
    text: `Your ${appName} verification code is ${code}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
    html: `
      <div style="font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
        <h2 style="margin:0 0 8px">${appName}</h2>
        <p style="margin:0 0 12px">Use the verification code below to continue signing in.</p>
        <div style="font-size:24px;font-weight:700;letter-spacing:6px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:10px;padding:12px 16px;display:inline-block">${code}</div>
        <p style="margin:12px 0 0;color:#555">This code expires in 10 minutes.</p>
        <p style="margin:12px 0 0;color:#6b7280;font-size:12px">If you didn’t request this, you can safely ignore this email.</p>
      </div>
    `,
  });

}
