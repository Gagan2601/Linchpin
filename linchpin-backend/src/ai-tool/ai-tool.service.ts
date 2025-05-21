import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AITool, AIToolDocument } from './schemas/ai-tool.schema';
import {
  AIToolInput,
  AIToolSchema,
  BulkAIToolInput,
} from './validations/ai-tool.zod';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import {
  AIToolSubmission,
  AIToolSubmissionDocument,
} from './schemas/ai-tool-submission.schema';
import {
  SubmitAIToolDto,
  RejectSubmissionDto,
  AIToolSubmissionInput,
} from './validations/ai-tool.zod';
import { z } from 'zod';

@Injectable()
export class AiToolService {
  constructor(
    @InjectModel(AITool.name)
    private readonly aiToolModel: Model<AIToolDocument>,
    @InjectModel(AIToolSubmission.name)
    private readonly aiToolSubmissionModel: Model<AIToolSubmissionDocument>,
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

  async getSubmissions(
    status?: 'pending' | 'approved' | 'rejected',
  ): Promise<AIToolSubmission[]> {
    try {
      const query = status ? { status } : {};
      const submissions = await this.aiToolSubmissionModel
        .find(query)
        .populate({
          path: 'submittedBy',
          select: 'username email',
          model: 'User',
        })
        .populate({
          path: 'reviewedBy',
          select: 'username',
          model: 'User',
        })
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      return submissions;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw new InternalServerErrorException('Failed to fetch submissions');
    }
  }

  async submitToolForApproval(
    toolData: SubmitAIToolDto,
    userId: string,
  ): Promise<AIToolSubmission> {
    try {
      // Validate input with Zod
      const validatedData = SubmitAIToolDto.parse(toolData);

      const submission = new this.aiToolSubmissionModel({
        toolData: validatedData,
        submittedBy: new Types.ObjectId(userId),
        status: 'pending',
      });
      return await submission.save();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException(error.errors);
      }
      throw new InternalServerErrorException(
        'Failed to submit tool for approval',
      );
    }
  }

  async approveSubmission(
    submissionId: string,
    adminId: string,
  ): Promise<AITool> {
    const session = await this.aiToolModel.db.startSession();
    session.startTransaction();

    try {
      const submission = await this.aiToolSubmissionModel
        .findById(submissionId)
        .session(session);
      if (!submission) {
        throw new NotFoundException('Submission not found');
      }
      if (submission.status !== 'pending') {
        throw new BadRequestException('Submission has already been processed');
      }

      // Validate the tool data before creating
      const toolData = AIToolSchema.parse(submission.toolData);

      // Create the AI tool from submission
      const newTool = new this.aiToolModel(toolData);
      const createdTool = await newTool.save({ session });

      // Update submission status
      submission.status = 'approved';
      submission.reviewedBy = new Types.ObjectId(adminId);
      submission.reviewedAt = new Date();
      await submission.save({ session });

      await session.commitTransaction();
      return createdTool;
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof z.ZodError) {
        throw new BadRequestException(error.errors);
      }
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to approve submission');
    } finally {
      session.endSession();
    }
  }

  async rejectSubmission(
    submissionId: string,
    adminId: string,
    rejectData: RejectSubmissionDto,
  ): Promise<AIToolSubmission> {
    try {
      // Validate rejection reason
      const { reason } = RejectSubmissionDto.parse(rejectData);

      const submission =
        await this.aiToolSubmissionModel.findById(submissionId);
      if (!submission) {
        throw new NotFoundException('Submission not found');
      }
      if (submission.status !== 'pending') {
        throw new BadRequestException('Submission has already been processed');
      }

      submission.status = 'rejected';
      submission.reviewedBy = new Types.ObjectId(adminId);
      submission.reviewedAt = new Date();
      submission.rejectionReason = reason;

      return await submission.save();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException(error.errors);
      }
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to reject submission');
    }
  }

  async getUserSubmissions(userId: string): Promise<AIToolSubmission[]> {
    try {
      return await this.aiToolSubmissionModel
        .find({ submittedBy: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch user submissions',
      );
    }
  }
}
