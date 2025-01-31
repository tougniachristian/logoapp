// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { promises as fs } from 'fs';
// import { Model } from 'mongoose';
// import { File } from './schemas/file.schema';
// import { UpdateFileDto } from './dto/file.dto';

// @Injectable()
// export class FileExploreService {
//   constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

//   async create(file: Express.Multer.File): Promise<File> {
//     const createdFile = new this.fileModel({
//       name: file.originalname,
//       path: file.path,
//       type: file.mimetype,
//       size: file.size,
//     });
//     return createdFile.save();
//   }

//   async findAll(): Promise<File[]> {
//     return this.fileModel.find().exec();
//   }

//   async findOne(id: string): Promise<File> {
//     const file = await this.fileModel.findById(id).exec();
//     if (!file) {
//       throw new NotFoundException(`File with ID "${id}" not found`);
//     }
//     return file;
//   }

//   async update(id: string, updateFileDto: UpdateFileDto): Promise<File> {
//     const updatedFile = await this.fileModel
//       .findByIdAndUpdate(id, updateFileDto, { new: true })
//       .exec();
//     if (!updatedFile) {
//       throw new NotFoundException(`File with ID "${id}" not found`);
//     }
//     return updatedFile;
//   }

//   async remove(id: string): Promise<void> {
//     const file = await this.findOne(id);
//     await fs.unlink(file.path);
//     await this.fileModel.findByIdAndDelete(id).exec();
//   }
// }
