import {
  Controller,
  Delete,
  Param,
  Patch,
  Body,
  Req,
  ForbiddenException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Types } from 'mongoose';
import { Throttle } from '@nestjs/throttler';
import { UserThrottlerGuard } from 'src/throttler/user-throttler.guard';

@Controller('user')
@UseGuards(UserThrottlerGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30/min
  getUser(@Param('id') id: string, @Req() req) {
    if (req.user._id.toString() !== id)
      throw new ForbiddenException('Access denied');
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  @Throttle({ default: { limit: 5, ttl: 86400000 } }) // 5/day
  deleteUser(@Param('id') id: string, @Req() req) {
    if (req.user._id.toString() !== id)
      throw new ForbiddenException('Access denied');
    return this.userService.deleteUser(id);
  }

  @Patch(':id')
  @Throttle({ default: { limit: 15, ttl: 60000 } }) // 15/min
  updateUser(
    @Param('id') id: string,
    @Body()
    body: {
      username?: string;
      aboutMe?: string;
      savedAIs?: Types.ObjectId[];
    },
    @Req() req,
  ) {
    if (req.user._id.toString() !== id)
      throw new ForbiddenException('Access denied');
    return this.userService.updateUser(id, body);
  }
}
