// src/throttler/user-throttler.guard.ts (keep as-is)
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    return req.user?.role === 'admin'; // Skip for admin routes
  }

  protected async getTracker(req: Request): Promise<string> {
    return (req.user as any)?._id || req.ip;
  }
}
