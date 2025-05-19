import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../user/schemas/user.schema';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedException('Missing or invalid token');

    const token = authHeader.split(' ')[1];
    try {
      const decoded: any = jwt.verify(
        token,
        this.configService.get('JWT_SECRET'),
      );
      const user = await this.userModel.findById(decoded.sub);

      if (!user) throw new UnauthorizedException('User not found');

      req['user'] = user;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
