import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  NotFoundException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Patch,
} from '@nestjs/common';
import { FileExploreService } from './file-explore.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('file-explore')
export class FileExploreController {
  constructor(private readonly fileService: FileExploreService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.fileService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':filename')
  async readFile(@Param('filename') filename: string) {
    return this.fileService.readFile(filename);
  }

  @Get(':id/preview')
  async previewFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.fileService.findOne(id);
    return res.sendFile(file.path, { root: '.' });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async writeFile(@Body() body: { filename: string; content?: string }) {
    if (body.content) {
      await this.fileService.writeFile(body.filename, body.content);
    } else {
      await this.fileService.createDirectory(body.filename);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateFile(
    @Param('id') id: string,
    @Body() updateFileDto: { name: string },
  ) {
    return this.fileService.update(id, updateFileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    await this.fileService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './storage',
        filename: (req, file, callback) => {
          // Génération d'un nom de fichier unique
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const fileExtension = extname(file.originalname);
          callback(null, `${uniqueSuffix}${fileExtension}`);
        },
      }),
      // Filtrage des fichiers
      fileFilter: (req, file, callback) => {
        // Liste des types de fichiers autorisés
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
          'text/plain',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        // Vérification du type de fichier
        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Type de fichier non autorisé'), false);
        }
      },
    }),
  )
  async importFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Limite de taille de fichier à 5MB
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
            message: 'Le fichier est trop volumineux (max 5MB)',
          }),
          // Validation supplémentaire du type de fichier
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|gif|pdf|txt|doc|docx)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const filename = await this.fileService.create(file);
    return { message: `File ${filename} imported successfully` };
  }

  @UseGuards(JwtAuthGuard)
  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.fileService.findOne(id);
    if (!fs.existsSync(file.path)) {
      throw new NotFoundException('Fichier non trouvé');
    }
    return res.download(file.path);
  }
}
