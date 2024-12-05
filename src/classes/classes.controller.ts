import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  async createClass(@Request() req, @Body('name') name: string) {
    return this.classesService.createClass(req.user.id, name);
  }

  @Put(':classId/students/:studentId/add')
  async addStudent(
    @Param('classId') classId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.classesService.addStudent(classId, studentId);
  }

  @Put(':classId/students/:studentId/remove')
  async remove(
    @Param('classId') classId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.classesService.removeStudent(classId, studentId);
  }

  @Get(':id')
  async getClassById(@Request() req, @Param('id') id: string) {
    return this.classesService.getClassById(id, req.user.id);
  }

  @Post(':id/join')
  async joinClass(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { link: string },
  ) {
    return this.classesService.joinClass(id, body.link, req.user.id);
  }

  @Post(':id/promote')
  async promoteToCoTeacher(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { studentId: string },
  ) {
    return this.classesService.promoteToCoTeacher(
      id,
      req.user.id,
      body.studentId,
    );
  }

  @Get()
  async getClassesForUser(@Request() req) {
    return this.classesService.getClassesForUser(req.user.id);
  }
}
