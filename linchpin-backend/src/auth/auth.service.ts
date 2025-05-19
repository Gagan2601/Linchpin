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
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);
    return { accessToken, refreshToken };
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
}
