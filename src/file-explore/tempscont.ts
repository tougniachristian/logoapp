// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Body,
//   Param,
//   UseGuards,
//   UseInterceptors,
//   UploadedFile,
//   Header,
//   StreamableFile,
// } from '@nestjs/common';
// import { FileExploreService } from './file-explore.service';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { UpdateFileDto } from './dto/file.dto';
// import { createReadStream } from 'fs';

// @UseGuards(JwtAuthGuard)
// @Controller('file-explore')
// export class FileExploreController {
//   constructor(private readonly fileService: FileExploreService) {}

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile(@UploadedFile() file: any) {
//     return this.fileService.create(file);
//   }

//   @Get()
//   async findAll() {
//     return this.fileService.findAll();
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     return this.fileService.findOne(id);
//   }

//   @Put(':id')
//   async update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
//     return this.fileService.update(id, updateFileDto);
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: string) {
//     return this.fileService.remove(id);
//   }

//   @Get('download/:id')
//   @Header('Content-Type', 'application/octet-stream')
//   @Header('Content-Disposition', 'attachment')
//   async downloadFile(@Param('id') id: string): Promise<StreamableFile> {
//     const file = await this.fileService.findOne(id);
//     const stream = createReadStream(file.path);
//     return new StreamableFile(stream);
//   }
// }
