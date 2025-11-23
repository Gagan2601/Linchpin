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
    // Try to get token from cookie first, then from authorization header
    let token = null;
    if (req.cookies && req.cookies['access_token']) {
      token = req.cookies['access_token'];
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) throw new UnauthorizedException('Missing or invalid token');

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
