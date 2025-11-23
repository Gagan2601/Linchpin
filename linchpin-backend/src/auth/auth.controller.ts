import {
  Controller,
  Post,
  Body,
  UsePipes,
  Param,
  Get,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { SignupSchema, SignupInput } from './validations/signup.zod';
import { LoginSchema, LoginInput } from './validations/login.zod';
import { UserThrottlerGuard } from 'src/throttler/user-throttler.guard';
import { Throttle } from '@nestjs/throttler';
import {
  InitiateResetInput,
  InitiateResetSchema,
  ResetPasswordInput,
  ResetPasswordSchema,
} from './validations/password-reset.zod';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response, Request } from 'express';

@Controller('auth')
@UseGuards(UserThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3/hr
  @UsePipes(new ZodValidationPipe(SignupSchema))
  signup(@Body() body: SignupInput) {
    return this.authService.signup(body);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5/min
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(
    @Body() body: LoginInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);

    // Set cookies for tokens
    if (result.accessToken && result.refreshToken) {
      // Set access token cookie (15 minutes)
      res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: false, //process.env.NODE_ENV === 'production'
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: '/',
        // domain: process.env.COOKIE_DOMAIN,
      });

      // Set refresh token cookie (7 days)
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: false, //process.env.NODE_ENV === 'production'
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
        // domain: process.env.COOKIE_DOMAIN,
      });
    }

    // Return user data without tokens
    return { user: result.user };
  }

  @Get('verify-email/:token')
  @Throttle({ default: { limit: 10, ttl: 3600000 } }) // 10/hr
  verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('forgot-password')
  @UsePipes(new ZodValidationPipe(InitiateResetSchema))
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 requests/hour
  async forgotPassword(@Body() { email }: InitiateResetInput) {
    return this.authService.initiatePasswordReset(email);
  }

  @Post('reset-password')
  @UsePipes(new ZodValidationPipe(ResetPasswordSchema))
  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 requests/hour
  async resetPassword(@Body() { token, newPassword }: ResetPasswordInput) {
    return this.authService.resetPassword(token, newPassword);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req) {
    return this.authService.getCurrentUser(req.user.userId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: false, //process.env.NODE_ENV === 'production'
      sameSite: 'lax',
      path: '/',
      // domain: process.env.COOKIE_DOMAIN,
    });

    res.cookie('refresh_token', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: false, //process.env.NODE_ENV === 'production'
      sameSite: 'lax',
      path: '/',
      // domain: process.env.COOKIE_DOMAIN,
    });

    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    const result = await this.authService.refreshToken(refreshToken);

    // Set new access token cookie
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === 'production'
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
      // domain: process.env.COOKIE_DOMAIN,
    });

    return { message: 'Token refreshed successfully' };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(
      req.user.userId,
      body.currentPassword,
      body.newPassword,
    );
  }
}
