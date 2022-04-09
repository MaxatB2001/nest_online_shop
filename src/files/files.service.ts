import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

export enum ImageType {
  PRODUCT = 'product',
  BRAND = 'brand',
  CATEGORY = 'category',
}

@Injectable()
export class FilesService {
  createFile(type: ImageType, file): string {
    try {
      const fileExtendtion = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtendtion;
      const filePath = path.resolve(__dirname, '..', 'static', type);
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
      return type + '/' + fileName;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}