import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateClassDto } from './dto/class.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createClass(@Request() req, @Body('name') name: string) {
    return this.classesService.createClass(req.user.id, name);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':classId/students/add')
  async addStudent(
    @Param('classId') classId: string,
    @Body('emails') emails: string,
  ) {
    const emailList = emails.split(',').map((email) => email.trim());
    return this.classesService.addStudent(classId, emailList);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':classId/students/:studentId/remove')
  async remove(
    @Param('classId') classId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.classesService.removeStudent(classId, studentId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':classId/co-teacher/:studentId/remove')
  async removeCoTeacher(
    @Param('classId') classId: string,
    @Param('coTeacherId') coTeacherId: string,
  ) {
    return this.classesService.removeCoTeacher(classId, coTeacherId);
  }

  @UseGuards(
    JwtAuthGuard,
    // new RolesGuard(['admin', 'teacher', 'user', 'co_teacher']),
  )
  @Get(':id')
  async getClassById(@Request() req, @Param('id') id: string) {
    return this.classesService.getClassById(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('join')
  async joinClass(@Request() req, @Body() body: { link: string }) {
    return this.classesService.joinClass(body.link, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateClass(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classesService.updateClass(id, updateClassDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteClass(@Param('id') id: string) {
    return this.classesService.deleteClass(id);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post(':id/retrograde')
  async retrogradeToStudent(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { coTeacherId: string },
  ) {
    return this.classesService.retrogradetoStudent(
      id,
      req.user.id,
      body.coTeacherId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getClassesForUser(@Request() req) {
    return this.classesService.getClassesForUser(req.user.id);
  }
}
