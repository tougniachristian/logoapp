import { Injectable } from '@nestjs/common';
import { existsSync, promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FileExploreService {
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
}
