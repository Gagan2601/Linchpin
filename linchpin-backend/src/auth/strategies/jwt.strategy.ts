import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Extract from cookie first
        (req: Request) => {
          if (req && req.cookies) {
            return req.cookies['access_token'];
          }
          return null;
        },
        // Fallback to Authorization header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'linchpin-secret',
    });
  }

  async validate(payload: any) {
    // You can add more checks here if needed
    return { userId: payload.sub, email: payload.email };
  }
}
