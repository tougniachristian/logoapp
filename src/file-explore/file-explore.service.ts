import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync, promises as fs } from 'fs';
import { Model } from 'mongoose';
import * as path from 'path';
import { File } from './schemas/file.schema';

@Injectable()
export class FileExploreService {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}
  private readonly basePath = path.join(__dirname, '..', '..', 'storage');

  async listFiles(directory = ''): Promise<string[]> {
    const fullPath = path.join(this.basePath, directory);
    const isFolderExist = existsSync(fullPath);
    if (!isFolderExist) {
      fs.mkdir(fullPath);
    }
    const files = await fs.readdir(fullPath);
    return files;
  }

  async readFile(filename: string): Promise<string> {
    const filePath = path.join(this.basePath, filename);
    return await fs.readFile(filePath, 'utf-8');
  }

  async writeFile(filename: string, content: string): Promise<void> {
    const filePath = path.join(this.basePath, filename);
    await fs.writeFile(filePath, content, 'utf-8');
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.basePath, filename);
    await fs.unlink(filePath);
  }

  async createDirectory(directory: string): Promise<void> {
    const dirPath = path.join(this.basePath, directory);
    await fs.mkdir(dirPath, { recursive: true });
  }

  // Méthode pour importer un fichier
  async importFile(file: Express.Multer.File): Promise<string> {
    const filePath = path.join(this.basePath, file.originalname);
    await fs.writeFile(filePath, file.buffer);
    return file.originalname;
  }

  async create(file: Express.Multer.File): Promise<File> {
    // const filePath = path.join(this.basePath, file.originalname);
    // await fs.writeFile(filePath, file.buffer);
    const createdFile = new this.fileModel({
      name: file.originalname,
      path: file.path,
      type: file.mimetype,
      size: file.size,
    });
    return createdFile.save();
  }

  async findAll(): Promise<File[]> {
    return this.fileModel.find().exec();
  }

  async findOne(id: string): Promise<File> {
    const file = await this.fileModel.findById(id).exec();
    if (!file) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }
    return file;
  }

  async update(id: string, updateFileDto: { name: string }): Promise<File> {
    return this.fileModel
      .findByIdAndUpdate(id, updateFileDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    const file = await this.findOne(id);
    await fs.unlink(file.path);
    await this.fileModel.findByIdAndDelete(id).exec();
  }
}
