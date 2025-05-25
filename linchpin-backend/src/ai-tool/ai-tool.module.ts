import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiToolController } from './ai-tool.controller';
import { AiToolService } from './ai-tool.service';
import { AITool, AIToolSchema } from './schemas/ai-tool.schema';
import { AuthMiddleware } from '../common/middleware/auth.middleware';
import { UserModule } from 'src/user/user.module';
import {
  AIToolSubmission,
  AIToolSubmissionSchema,
} from './schemas/ai-tool-submission.schema';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AITool.name, schema: AIToolSchema },
      { name: AIToolSubmission.name, schema: AIToolSubmissionSchema },
    ]),
    UserModule,
  ],
  providers: [AiToolService, EmailService],
  controllers: [AiToolController],
})
export class AiToolModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'ai-tools/ai', method: RequestMethod.POST },
      { path: 'ai-tools/ai/bulk', method: RequestMethod.POST },
      { path: 'ai-tools/ai/:id', method: RequestMethod.PATCH },
      { path: 'ai-tools/ai/:id', method: RequestMethod.DELETE },
      { path: 'ai-tools/ai/:id/review', method: RequestMethod.POST },
      {
        path: 'ai-tools/ai/:id/review/:reviewId',
        method: RequestMethod.DELETE,
      },
      { path: 'ai-tools/submissions', method: RequestMethod.GET },
      {
        path: 'ai-tools/submissions/:id/approve',
        method: RequestMethod.PATCH,
      },
      {
        path: 'ai-tools/submissions/:id/reject',
        method: RequestMethod.PATCH,
      },
      {
        path: 'ai-tools/submissions/submit',
        method: RequestMethod.POST,
      },
      {
        path: 'ai-tools/submissions/my',
        method: RequestMethod.GET,
      },
      {
        path: 'ai-tools/submissions/notifications',
        method: RequestMethod.GET,
      },
      {
        path: 'ai-tools/submissions/:toolId/notifications/:notificationId/read',
        method: RequestMethod.PATCH,
      },
    );
  }
}
