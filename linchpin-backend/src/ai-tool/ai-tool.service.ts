import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AITool, AIToolDocument } from './schemas/ai-tool.schema';
import { AIToolInput, BulkAIToolInput } from './validations/ai-tool.zod';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class AiToolService {
  constructor(
    @InjectModel(AITool.name)
    private readonly aiToolModel: Model<AIToolDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(data: AIToolInput): Promise<AITool> {
    try {
      const newTool = new this.aiToolModel(data);
      return await newTool.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create AI Tool');
    }
  }

  async createBulk(tools: BulkAIToolInput): Promise<AIToolDocument[]> {
    try {
      const created = await this.aiToolModel.insertMany(tools);
      return created.map((tool) => tool.toObject());
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to insert AI tools in bulk',
      );
    }
  }

  async findAll(): Promise<AITool[]> {
    try {
      return await this.aiToolModel.find().sort({ createdAt: -1 }).exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch AI tools');
    }
  }

  async findOne(id: string): Promise<AITool> {
    try {
      const tool = await this.aiToolModel.findById(id).exec();
      if (!tool) {
        throw new NotFoundException(`AI Tool with ID ${id} not found`);
      }
      return tool;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch AI tool');
    }
  }

  async update(id: string, updateData: Partial<AIToolInput>): Promise<AITool> {
    try {
      const updated = await this.aiToolModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updated) {
        throw new NotFoundException(`AI Tool with ID ${id} not found`);
      }
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update AI tool');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.aiToolModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`AI Tool with ID ${id} not found`);
      }
      return { message: 'AI Tool deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete AI tool');
    }
  }

  async addReview(
    toolId: string,
    userId: string,
    rating: number,
    comment: string,
  ) {
    const user = await this.userModel
      .findById(userId)
      .select('username designation')
      .exec();
    if (!user) throw new NotFoundException('User not found');

    const newReview = {
      userId: new Types.ObjectId(userId),
      username: user.username,
      designation: user.designation || 'N/A',
      rating,
      comment,
    };

    const tool = await this.aiToolModel.findById(toolId);
    if (!tool) throw new NotFoundException('AI Tool not found');

    tool.reviews.push(newReview);

    // Recalculate average rating
    const totalRating = tool.reviews.reduce((acc, r) => acc + r.rating, 0);
    tool.total_rating = parseFloat(
      (totalRating / tool.reviews.length).toFixed(1),
    );

    await tool.save();

    return { message: 'Review added successfully', review: newReview };
  }

  async deleteReview(toolId: string, reviewId: string, userId: string) {
    const tool = await this.aiToolModel.findById(toolId);
    if (!tool) throw new NotFoundException('AI Tool not found');

    const review = tool.reviews.find((r) => r._id.toString() === reviewId);
    if (!review) throw new NotFoundException('Review not found');

    if (review.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('You can only delete your own review');
    }

    tool.reviews = tool.reviews.filter((r) => r._id.toString() !== reviewId);

    // Recalculate average rating
    const totalRating = tool.reviews.reduce((acc, r) => acc + r.rating, 0);
    tool.total_rating = tool.reviews.length
      ? parseFloat((totalRating / tool.reviews.length).toFixed(1))
      : null;

    await tool.save();

    return { message: 'Review deleted successfully' };
  }

  async getAllReviews(toolId: string): Promise<any[]> {
    const tool = await this.aiToolModel.findById(toolId);
    if (!tool) throw new NotFoundException('AI Tool not found');
    return tool.reviews;
  }
}
