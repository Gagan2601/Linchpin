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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AITool.name, schema: AIToolSchema }]),
    UserModule,
  ],
  providers: [AiToolService],
  controllers: [AiToolController],
})
export class AiToolModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'ai-tools', method: RequestMethod.POST },
        { path: 'ai-tools/bulk', method: RequestMethod.POST },
        { path: 'ai-tools/:id', method: RequestMethod.PATCH },
        { path: 'ai-tools/:id', method: RequestMethod.DELETE },
        { path: 'ai-tools/:id/review', method: RequestMethod.POST },
        { path: 'ai-tools/:id/review/:reviewId', method: RequestMethod.DELETE },
      );
  }
}
