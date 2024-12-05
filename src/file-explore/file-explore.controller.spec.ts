import { Test, TestingModule } from '@nestjs/testing';
import { FileExploreController } from './file-explore.controller';

describe('FileExploreController', () => {
  let controller: FileExploreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileExploreController],
    }).compile();

    controller = module.get<FileExploreController>(FileExploreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
