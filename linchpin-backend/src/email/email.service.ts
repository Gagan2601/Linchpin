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
    const verificationLink = `http://localhost:3001/auth/verify-email/${token}`; //change when frontend ready

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

  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `http://localhost:3001/auth/reset-password?token=${token}`; //change when frontend ready

    await this.transporter.sendMail({
      from: '"Linchpin" <thelinchpin.tech@gmail.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a href="${resetLink}" style="padding: 10px 15px; background: #0070f3; color: white; text-decoration: none;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  async sendSubmissionStatusEmail(
    email: string,
    toolName: string,
    status: 'approved' | 'rejected',
    reason?: string,
  ) {
    const statusMsg =
      status === 'approved'
        ? 'has been approved and published!'
        : `was rejected. ${reason ? `Reason: ${reason}` : ''}`;

    const frontendUrl = `http://localhost:3001/notification`; //add frontend url

    await this.transporter.sendMail({
      to: email,
      subject: `Your AI Tool Submission Update - ${toolName}`,
      html: `
      <h2>Submission Status Update</h2>
      <p>Your AI tool <strong>${toolName}</strong> ${statusMsg}</p>
      <a href="${frontendUrl}/submissions" style="...">View Submission</a>   
    `,
    });
  }
}
