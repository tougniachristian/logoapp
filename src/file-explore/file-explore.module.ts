import { Module } from '@nestjs/common';
import { FileExploreController } from './file-explore.controller';
import { FileExploreService } from './file-explore.service';

@Module({
  controllers: [FileExploreController],
  providers: [FileExploreService],
})
export class FileExploreModule {}
