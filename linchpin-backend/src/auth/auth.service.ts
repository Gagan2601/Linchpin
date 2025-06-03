import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as dayjs from 'dayjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupInput } from './validations/signup.zod';
import { LoginInput } from './validations/login.zod';
import { User, UserDocument } from '../user/schemas/user.schema';
import { EmailService } from 'src/email/email.service';
import { sanitizeUser } from 'src/common/utils/sanitize-user';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // Signup Logic
  async signup(dto: SignupInput) {
    try {
      const existingUser = await this.userModel.findOne({
        $or: [{ email: dto.email }, { username: dto.username }],
      });

      if (existingUser) {
        if (existingUser.email === dto.email) {
          throw new BadRequestException('Email already registered.');
        }
        if (existingUser.username === dto.username) {
          throw new BadRequestException('Username already taken.');
        }
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const emailVerificationToken = randomBytes(32).toString('hex');
      const emailVerificationTokenExpires = dayjs().add(5, 'minutes').toDate();

      const newUser = new this.userModel({
        ...dto,
        password: hashedPassword,
        aboutMe: '',
        designation: '',
        savedAIs: [],
        isEmailVerified: false,
        emailVerificationToken,
        emailVerificationTokenExpires,
        autoDeleteAt: new Date(),
      });

      const savedUser = await newUser.save();

      await this.emailService.sendVerificationEmail(
        savedUser.email,
        emailVerificationToken,
      );

      return {
        message:
          'Signup successful. Please check your email to verify your account.',
      };
    } catch (error) {
      console.error('Signup Error:', error);
      throw new BadRequestException(
        error?.message || 'Something went wrong during signup.',
      );
    }
  }

  // Login Logic
  async login(dto: LoginInput) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');

      if (!user.isEmailVerified) {
        throw new UnauthorizedException(
          'Please verify your email before logging in.',
        );
      }

      const tokens = await this.generateTokens(user._id.toString(), user.email);

      return { user: sanitizeUser(user), ...tokens };
    } catch (error) {
      console.error('Login Error:', error);
      throw new UnauthorizedException(
        error?.message || 'Something went wrong during login.',
      );
    }
  }

  // Generate access & refresh tokens
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, userId, email }; // Added userId for consistency
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);
    return { accessToken, refreshToken };
  }

  // Refresh token logic
  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      // Generate new access token
      const newAccessToken = await this.jwtService.signAsync(
        { sub: payload.sub, userId: payload.userId, email: payload.email },
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Email verification logic
  async verifyEmail(token: string) {
    try {
      const user = await this.userModel.findOne({
        emailVerificationToken: token,
        emailVerificationTokenExpires: { $gt: new Date() },
      });

      if (!user) {
        throw new BadRequestException('Invalid or expired verification token');
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationTokenExpires = null;
      user.autoDeleteAt = null;

      await user.save();

      return { message: 'Email verified successfully. You can now login.' };
    } catch (error) {
      console.error('Verify Email Error:', error);
      throw new BadRequestException(
        error?.message || 'Email verification failed.',
      );
    }
  }

  async initiatePasswordReset(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        // Don't reveal if user doesn't exist for security
        return { message: 'If an account exists, a reset link has been sent' };
      }

      const resetToken = randomBytes(32).toString('hex');
      const resetTokenExpires = dayjs().add(1, 'hour').toDate();

      user.passwordResetToken = resetToken;
      user.passwordResetTokenExpires = resetTokenExpires;
      await user.save();

      await this.emailService.sendPasswordResetEmail(user.email, resetToken);

      return { message: 'Password reset link sent to your email' };
    } catch (error) {
      console.error('Password reset error:', error);
      throw new BadRequestException('Failed to initiate password reset');
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const user = await this.userModel.findOne({
        passwordResetToken: token,
        passwordResetTokenExpires: { $gt: new Date() },
      });

      if (!user) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.passwordResetToken = null;
      user.passwordResetTokenExpires = null;
      await user.save();

      return { message: 'Password reset successfully' };
    } catch (error) {
      console.error('Reset password error:', error);
      throw new BadRequestException(
        error?.message || 'Failed to reset password',
      );
    }
  }

  async getCurrentUser(userId: string) {
    try {
      const user = await this.userModel.findById(userId).select('-password');
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return sanitizeUser(user);
    } catch (error) {
      console.error('Get Current User Error:', error);
      throw new UnauthorizedException('Invalid session');
    }
  }

  async logout(res: Response) {
    try {
      // Clear the httpOnly cookies
      res.cookie('access_token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.cookie('refresh_token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return { message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout Error:', error);
      throw new UnauthorizedException('Logout failed');
    }
  }
}
