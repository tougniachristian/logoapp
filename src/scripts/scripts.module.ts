import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Script, ScriptSchema } from './schemas/script.schema';
import { ScriptsService } from './scripts.service';
import { ScriptsController } from './scripts.controller';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    SearchModule,
    MongooseModule.forFeature([{ name: Script.name, schema: ScriptSchema }]),
  ],
  providers: [ScriptsService],
  controllers: [ScriptsController],
})
export class ScriptsModule {}
