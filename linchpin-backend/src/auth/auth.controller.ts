import { Controller, Post, Body, UsePipes, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { SignupSchema, SignupInput } from './validations/signup.zod';
import { LoginSchema, LoginInput } from './validations/login.zod';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(SignupSchema))
  signup(@Body() body: SignupInput) {
    return this.authService.signup(body);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  login(@Body() body: LoginInput) {
    return this.authService.login(body);
  }

  @Get('verify-email/:token')
  verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
