import { Test, TestingModule } from '@nestjs/testing';
import { AiToolController } from './ai-tool.controller';

describe('AiToolController', () => {
  let controller: AiToolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiToolController],
    }).compile();

    controller = module.get<AiToolController>(AiToolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
