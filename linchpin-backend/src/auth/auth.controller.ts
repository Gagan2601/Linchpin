import {
  Controller,
  Post,
  Body,
  UsePipes,
  Param,
  Get,
  UseGuards,
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
  login(@Body() body: LoginInput) {
    return this.authService.login(body);
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
}
