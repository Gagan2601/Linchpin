import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_SMTP_USER,
      pass: process.env.GMAIL_SMTP_PASS,
    },
  });

  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `http://localhost:3000/api/auth/verify-email/${token}`;

    const info = await this.transporter.sendMail({
      from: '"Linchpin" <thelinchpin.tech@gmail.com>',
      to: email,
      subject: 'Verify your email',
      html: `
        <h2>Verify your email</h2>
        <p>Please click the button below to verify your email. This link will expire in 5 minutes.</p>
        <a href="${verificationLink}" style="padding: 10px 15px; background: #0070f3; color: white; text-decoration: none;">Verify Email</a>
      `,
    });

    return info;
  }
}
