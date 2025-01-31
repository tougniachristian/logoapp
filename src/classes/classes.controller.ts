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
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @UseGuards(JwtAuthGuard, new RolesGuard(['admin', 'teacher']))
  @Post()
  async createClass(@Request() req, @Body('name') name: string) {
    return this.classesService.createClass(req.user.id, name);
  }

  @UseGuards(JwtAuthGuard, new RolesGuard(['admin', 'teacher', 'co_teacher']))
  @Put(':classId/students/add')
  async addStudent(
    @Param('classId') classId: string,
    @Body('email') email: string,
  ) {
    return this.classesService.addStudent(classId, email);
  }

  @UseGuards(JwtAuthGuard, new RolesGuard(['admin', 'teacher']))
  @Put(':classId/students/:studentId/remove')
  async remove(
    @Param('classId') classId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.classesService.removeStudent(classId, studentId);
  }

  @UseGuards(JwtAuthGuard, new RolesGuard(['admin', 'teacher']))
  @Get(':id')
  async getClassById(@Request() req, @Param('id') id: string) {
    return this.classesService.getClassById(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard, new RolesGuard(['user']))
  @Post(':id/join')
  async joinClass(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { link: string },
  ) {
    return this.classesService.joinClass(id, body.link, req.user.id);
  }

  @UseGuards(JwtAuthGuard, new RolesGuard(['admin', 'teacher']))
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

  @UseGuards(JwtAuthGuard, new RolesGuard(['user', 'teacher']))
  @Get()
  async getClassesForUser(@Request() req) {
    return this.classesService.getClassesForUser(req.user.id);
  }
}
