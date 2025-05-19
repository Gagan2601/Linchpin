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
} from '@nestjs/common';
import { AiToolService } from './ai-tool.service';

@Controller('ai-tools')
export class AiToolController {
  constructor(private readonly aiToolService: AiToolService) {}

  private checkAdmin(req: any) {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenException('Only admins can perform this action');
    }
  }

  @Post('bulk')
  async createBulk(@Body() tools: any[], @Req() req) {
    this.checkAdmin(req);
    // Optionally validate each tool with Zod schema here
    return this.aiToolService.createBulk(tools);
  }

  @Post()
  async create(@Body() tool: any, @Req() req) {
    this.checkAdmin(req);
    return this.aiToolService.create(tool);
  }

  @Get()
  findAll() {
    return this.aiToolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiToolService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any, @Req() req) {
    this.checkAdmin(req);
    return this.aiToolService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    this.checkAdmin(req);
    return this.aiToolService.remove(id);
  }

  @Post(':id/review')
  async addReview(
    @Param('id') toolId: string,
    @Body() { rating, comment }: { rating: number; comment: string },
    @Req() req,
  ) {
    return this.aiToolService.addReview(toolId, req.user._id, rating, comment);
  }

  @Delete(':id/review/:reviewId')
  async deleteReview(
    @Param('id') toolId: string,
    @Param('reviewId') reviewId: string,
    @Req() req,
  ) {
    return this.aiToolService.deleteReview(toolId, reviewId, req.user._id);
  }

  @Get(':id/reviews')
  async getAllReviews(@Param('id') toolId: string) {
    return this.aiToolService.getAllReviews(toolId);
  }
}
