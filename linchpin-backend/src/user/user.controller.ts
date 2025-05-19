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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUser(@Param('id') id: string, @Req() req) {
    if (req.user._id.toString() !== id)
      throw new ForbiddenException('Access denied');
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string, @Req() req) {
    if (req.user._id.toString() !== id)
      throw new ForbiddenException('Access denied');
    return this.userService.deleteUser(id);
  }

  @Patch(':id')
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
