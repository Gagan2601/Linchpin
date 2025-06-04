import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../user/schemas/user.schema';
import { EmailService } from 'src/email/email.service';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'linchpin-secret',
      signOptions: { expiresIn: '15m' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, EmailService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // REMOVE or COMMENT OUT this block:
    // consumer
    //   .apply(AuthMiddleware)
    //   .forRoutes(
    //     { path: 'auth/me', method: RequestMethod.GET },
    //     { path: 'auth/logout', method: RequestMethod.POST },
    //     { path: 'auth/refresh', method: RequestMethod.POST },
    //   );
  }
}
