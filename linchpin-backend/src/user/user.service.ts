import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { sanitizeUser } from 'src/common/utils/sanitize-user';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserById(id: string) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('User not found');
      return sanitizeUser(user);
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw new InternalServerErrorException(
        error?.message || 'Failed to fetch user',
      );
    }
  }

  async deleteUser(id: string) {
    try {
      const deleted = await this.userModel.findByIdAndDelete(id);
      if (!deleted) throw new NotFoundException('User not found');
      return { message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw new InternalServerErrorException(
        error?.message || 'Failed to delete user',
      );
    }
  }

  async updateUser(
    id: string,
    updates: Partial<
      Pick<User, 'name' | 'username' | 'aboutMe' | 'savedAIs' | 'designation'>
    >,
  ) {
    try {
      if (updates.username) {
        const existingUser = await this.userModel.findOne({
          username: updates.username,
          _id: { $ne: id }, // exclude the current user
        });

        if (existingUser) {
          throw new BadRequestException('Username is already taken.');
        }
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true },
      );

      if (!updatedUser) throw new NotFoundException('User not found');

      return sanitizeUser(updatedUser);
    } catch (error) {
      console.error('Error in updateUser:', error);
      // If already thrown a specific exception, just rethrow
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        error?.message || 'Failed to update user',
      );
    }
  }
}
