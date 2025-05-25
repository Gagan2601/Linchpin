import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  ForbiddenException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AiToolService } from './ai-tool.service';
import {
  SubmitAIToolDto,
  RejectSubmissionDto,
  NotificationResponse,
} from './validations/ai-tool.zod';
import { UserThrottlerGuard } from 'src/throttler/user-throttler.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('ai-tools')
@UseGuards(UserThrottlerGuard)
export class AiToolController {
  constructor(private readonly aiToolService: AiToolService) {}

  private checkAdmin(req: any) {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenException('Only admins can perform this action');
    }
  }

  @Post('ai/bulk')
  async createBulk(@Body() tools: any[], @Req() req) {
    this.checkAdmin(req);
    // Optionally validate each tool with Zod schema here
    return this.aiToolService.createBulk(tools);
  }

  @Post('ai')
  async create(@Body() tool: any, @Req() req) {
    this.checkAdmin(req);
    return this.aiToolService.create(tool);
  }

  @Get('ai/all')
  @Throttle({ default: { limit: 60, ttl: 60000 } }) // 60/min
  findAll() {
    return this.aiToolService.findAll();
  }

  @Get('ai/:id')
  findOne(@Param('id') id: string) {
    return this.aiToolService.findOne(id);
  }

  @Patch('ai/:id')
  async update(@Param('id') id: string, @Body() data: any, @Req() req) {
    this.checkAdmin(req);
    return this.aiToolService.update(id, data);
  }

  @Delete('ai/:id')
  async remove(@Param('id') id: string, @Req() req) {
    this.checkAdmin(req);
    return this.aiToolService.remove(id);
  }

  @Post('ai/:id/review')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5/min
  async addReview(
    @Param('id') toolId: string,
    @Body() { rating, comment }: { rating: number; comment: string },
    @Req() req,
  ) {
    return this.aiToolService.addReview(toolId, req.user._id, rating, comment);
  }

  @Delete('ai/:id/review/:reviewId')
  async deleteReview(
    @Param('id') toolId: string,
    @Param('reviewId') reviewId: string,
    @Req() req,
  ) {
    return this.aiToolService.deleteReview(toolId, reviewId, req.user._id);
  }

  @Get('ai/:id/reviews')
  async getAllReviews(@Param('id') toolId: string) {
    return this.aiToolService.getAllReviews(toolId);
  }

  @Post('submissions/submit')
  @Throttle({ default: { limit: 5, ttl: 86400000 } }) // 5/day
  async submitTool(@Body() toolData: SubmitAIToolDto, @Req() req) {
    return this.aiToolService.submitToolForApproval(toolData, req.user._id);
  }

  @Get('submissions')
  async getSubmissions(@Query('status') status: string, @Req() req) {
    this.checkAdmin(req);
    return this.aiToolService.getSubmissions(status as any);
  }

  @Patch('submissions/:id/approve')
  async approveSubmission(@Param('id') id: string, @Req() req) {
    this.checkAdmin(req);
    return this.aiToolService.approveSubmission(id, req.user._id);
  }

  @Patch('submissions/:id/reject')
  async rejectSubmission(
    @Param('id') id: string,
    @Body() rejectData: RejectSubmissionDto,
    @Req() req,
  ) {
    this.checkAdmin(req);
    return this.aiToolService.rejectSubmission(id, req.user._id, rejectData);
  }

  @Get('submissions/my')
  async getUserSubmissions(@Req() req) {
    return this.aiToolService.getUserSubmissions(req.user._id);
  }

  @Get('submissions/notifications')
  async getNotifications(@Req() req): Promise<NotificationResponse[]> {
    return this.aiToolService.getNotifications(req.user._id);
  }

  @Patch('submissions/:toolId/notifications/:notificationId/read')
  async markNotificationAsRead(
    @Param('toolId') toolId: string,
    @Param('notificationId') notificationId: string,
    @Req() req,
  ) {
    await this.aiToolService.markNotificationAsRead(
      req.user._id,
      toolId,
      notificationId,
    );
    return { message: 'Notification marked as read' };
  }
}
