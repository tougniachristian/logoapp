import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Script } from './schemas/script.schema';
import { SearchService } from '../search/search.service';
import { v4 as uuidv4 } from 'uuid'; // UUID pour les liens uniques.

@Injectable()
export class ScriptsService {
  constructor(
    @InjectModel(Script.name) private scriptModel: Model<Script>,
    private readonly searchService: SearchService,
  ) {}

  async createScript(
    userId: string,
    title: string,
    content: string,
    isPublic: boolean,
    tags: string[],
  ) {
    const existingScript = await this.scriptModel.find({ title });
    if (existingScript.length > 0) {
      throw new ConflictException('Script déjà existant');
    }
    const script = await this.scriptModel.create({
      userId,
      title,
      content,
      isPublic,
      tags,
    });

    return script;
  }

  async getUserScripts(userId: string) {
    return this.scriptModel.find({ userId });
  }

  async updateScript(
    userId: string,
    scriptId: string,
    updates: Partial<Script>,
  ) {
    const script = await this.scriptModel.findOneAndUpdate(
      { _id: scriptId, userId },
      { ...updates, updatedAt: new Date() },
      { new: true },
    );

    if (!script) throw new NotFoundException('Script non trouvé');

    if (script.isPublic) {
      // await this.searchService.indexDocument('scripts', script._id.toString(), {
      //   title: script.title,
      //   content: script.content,
      //   tags: script.tags,
      //   userId: script.userId,
      // });
    }

    return script;
  }

  async deleteScript(userId: string, scriptId: string) {
    try {
      const script = await this.scriptModel.findOneAndDelete({
        _id: scriptId,
        userId,
      });

      if (!script) throw new NotFoundException('Script non trouvé');

      // if (script.isPublic) {
      //   await this.searchService.deleteDocument('scripts', scriptId);
      // }
      return { message: 'Script supprimé avec succès' };
    } catch (error) {
      throw new Error(error);
    }
  }

  async searchPublicScripts(tags: string[]) {
    return this.scriptModel.find({ isPublic: true, tags: { $in: tags } });
  }

  async findById(scriptId: string): Promise<Script> {
    const script = await this.scriptModel.findById(scriptId);
    if (!script) throw new NotFoundException('Script not found');
    return script;
  }

  async findByTitle(name: string): Promise<Script> {
    const script = await this.scriptModel.findOne({ title: name });
    if (!script) throw new NotFoundException('Script not found');
    return script;
  }

  async generateSharedLink(
    scriptId: string,
    ownerId: string,
  ): Promise<{ sharedLink: string }> {
    const script = await this.scriptModel.findOne({
      _id: scriptId,
      userId: ownerId,
    });
    if (!script)
      throw new NotFoundException('Script not found or not authorized');
    const sharedLink = uuidv4();
    script.sharedLink = sharedLink;
    await script.save();
    return { sharedLink };
  }

  async revokeSharedLink(scriptId: string, ownerId: string): Promise<any> {
    const script = await this.scriptModel.findOne({
      _id: scriptId,
      userId: ownerId,
    });
    if (!script)
      throw new NotFoundException('Script not found or not authorized');
    script.sharedLink = null;
    await script.save();
    return { message: 'Script saved successfully' };
  }

  async findBySharedLink(sharedLink: string): Promise<Script> {
    const script = await this.scriptModel.findOne({ sharedLink });
    if (!script) throw new NotFoundException('Shared script not found');
    return script;
  }

  async importScript(scriptId: string, userId: string): Promise<Script> {
    const originalScript = await this.findById(scriptId);
    if (!originalScript.isPublic && originalScript.userId !== userId) {
      throw new NotFoundException(`Script not found or not accessible`);
    }
    console.log(originalScript);

    const importedScript = new this.scriptModel({
      ...originalScript.toObject(),
      _id: undefined,
      userId,
      importedFrom: originalScript._id,
      sharedLink: null,
      isPublic: false,
    });

    return importedScript.save();
  }

  // async shareScript(scriptId: string) {
  //   const script = await this.scriptModel.findById(scriptId);
  //   if (!script) {
  //     throw new NotFoundException('Script non trouvé');
  //   }
  //   return { link: `https://yourapp.com/scripts/${scriptId}` }; // Exemple de lien
  // }
}
