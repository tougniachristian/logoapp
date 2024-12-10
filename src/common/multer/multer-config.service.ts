import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MulterConfigService {
  static storage = diskStorage({
    destination: './storage', // Dossier où les fichiers seront stockés
    filename: (req, file, cb) => {
      const filename = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, filename); // Génère un nom de fichier unique
    },
  });

  static fileFilter(req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; // Extensions autorisées
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Fichier non autorisé'), false);
    }
    cb(null, true);
  }
}
