import { Module } from '@nestjs/common';
import { FileExploreController } from './file-explore.controller';
import { FileExploreService } from './file-explore.service';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  controllers: [FileExploreController],
  providers: [FileExploreService],
})
export class FileExploreModule {}
