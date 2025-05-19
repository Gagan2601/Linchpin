import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../user/schemas/user.schema';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'linchpin-secret' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, EmailService],
  controllers: [AuthController],
})
export class AuthModule {}
