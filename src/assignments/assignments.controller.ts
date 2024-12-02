import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  async createAssignment(
    @Request() req,
    @Body() body: { classId: string; title: string; description: string },
  ) {
    return this.assignmentsService.createAssignment(
      req.body.classId,
      req.user.id,
      body.title,
      body.description,
    );
  }

  @Get('class/:id')
  async getAssignmentsForClass(@Param('id') classId: string) {
    return this.assignmentsService.getAssignmentsForClass(classId);
  }

  @Post(':id/submit')
  async submitAssignment(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { content: string },
  ) {
    return this.assignmentsService.submitAssignment(
      id,
      req.user.id,
      body.content,
    );
  }

  @Post(':id/grade')
  async gradeSubmission(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { studentId: string; grade: number; feedback: string },
  ) {
    return this.assignmentsService.gradeSubmission(
      id,
      req.user.id,
      body.studentId,
      body.grade,
      body.feedback,
    );
  }

  @Get(':id/progress')
  async getProgressForClass(@Request() req, @Param('id') id: string) {
    return this.assignmentsService.getProgressForClass(id, req.user.id);
  }
}
