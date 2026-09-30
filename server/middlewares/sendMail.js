import { createTransport } from "nodemailer";

// Helper: create the right transporter
// Priority: 1. Brevo SMTP (works on Render) → 2. Gmail SMTP (local dev only)
const createMailTransport = () => {
  if (process.env.BREVO_USER && process.env.BREVO_PASS) {
    // Brevo (Sendinblue) SMTP — works on Render free tier, no domain needed
    return createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });
  }

  // Fallback: Gmail SMTP (local development only — blocked on Render)
  return createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });
};

// =============================================
// 1. OTP Email (Registration)
// =============================================
const sendMail = async (email, subject, data) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f7f9fc; }
        .container { background-color: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); text-align: center; max-width: 450px; width: 90%; }
        h1 { color: #6a1b9a; margin-bottom: 10px; font-size: 24px; }
        p { margin-bottom: 20px; color: #555; font-size: 15px; line-height: 1.5; }
        .otp-box { background: #f3e8ff; border: 2px dashed #9333ea; border-radius: 8px; padding: 15px; margin: 20px 0; }
        .otp { font-size: 36px; font-weight: bold; color: #7e22ce; letter-spacing: 6px; margin: 0; }
        .footer { font-size: 12px; color: #888; margin-top: 25px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Smart Samarpan Academy</h1>
        <p>Hello <strong>${data.name}</strong>,</p>
        <p>Your 6-digit One-Time Password (OTP) for account verification is:</p>
        <div class="otp-box">
            <p class="otp">${data.otp}</p>
        </div>
        <p>This code is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
        <div class="footer">
            <p>© Samarpan Math Academy. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

  const transport = createMailTransport();
  const fromEmail = process.env.BREVO_USER || process.env.Gmail;

  return await transport.sendMail({
    from: `"Samarpan Math Academy" <${fromEmail}>`,
    to: email,
    subject,
    html,
  });
};

export default sendMail;

// =============================================
// 2. Forgot Password Email
// =============================================
export const sendForgotMail = async (subject, data) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f3f3f3; margin: 0; padding: 0; }
    .container { background-color: #ffffff; padding: 25px; margin: 30px auto; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); max-width: 500px; text-align: center; }
    h1 { color: #6a1b9a; font-size: 22px; }
    p { color: #555; line-height: 1.5; font-size: 14px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #7e22ce; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Password Request</h1>
    <p>We received a request to reset your password. Click the button below to proceed:</p>
    <a href="${process.env.frontendurl || 'https://smart-samarpan-academy.vercel.app'}/reset-password/${data.token}" class="button">Reset Password</a>
    <p>If you didn't request this, you can safely ignore this email.</p>
  </div>
</body>
</html>`;

  const transport = createMailTransport();
  const fromEmail = process.env.BREVO_USER || process.env.Gmail;

  return await transport.sendMail({
    from: `"Samarpan Math Academy" <${fromEmail}>`,
    to: data.email,
    subject,
    html,
  });
};