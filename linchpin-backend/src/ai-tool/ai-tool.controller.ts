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
} from '@nestjs/common';
import { AiToolService } from './ai-tool.service';
import {
  SubmitAIToolDto,
  RejectSubmissionDto,
} from './validations/ai-tool.zod';

@Controller('ai-tools')
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
}
