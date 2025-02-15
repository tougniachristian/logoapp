import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/common/multer/multer-config.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: MulterConfigService.storage,
      fileFilter: MulterConfigService.fileFilter,
    }),
  )
  async createAssignment(
    @Request() req,
    @Body()
    body: {
      classId: string;
      title: string;
      description: string;
      dueDate: Date;
      logoScriptToComplete?: string;
    },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const filePaths = files.map((file) => `/storage/${file.filename}`);
    return this.assignmentsService.createAssignment(
      req.body.classId,
      req.user.id,
      body.title,
      body.description,
      filePaths,
      body.dueDate,
      body.logoScriptToComplete,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('class/:id')
  async getAssignmentsForClass(@Param('id') classId: string) {
    return this.assignmentsService.getAssignmentsForClass(classId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('submission/:id')
  async getSubmission(@Param('id') classId: string) {
    return this.assignmentsService.getSubmissions(classId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterConfigService.storage,
      fileFilter: MulterConfigService.fileFilter,
    }),
  )
  async submitAssignment(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { content: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = `/storage/${file?.filename}`;
    return this.assignmentsService.submitAssignment(
      id,
      req.user.id,
      body.content,
      filePath,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/grade')
  async gradeSubmission(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { studentId: string; grade: number; feedback?: string },
  ) {
    return this.assignmentsService.gradeSubmission(
      id,
      req.user.id,
      body.studentId,
      body.grade,
      body.feedback,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/progress')
  async getProgressForClass(@Request() req, @Param('id') id: string) {
    return this.assignmentsService.getProgressForClass(id, req.user.id);
  }
}
