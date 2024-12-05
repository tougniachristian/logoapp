import { Test, TestingModule } from '@nestjs/testing';
import { FileExploreService } from './file-explore.service';

describe('FileExploreService', () => {
  let service: FileExploreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileExploreService],
    }).compile();

    service = module.get<FileExploreService>(FileExploreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
