import { Logger } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import fs = require('fs');

import path = require('path');

const validMimeType = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/pdf',
];

//! File extension supported:
export const saveImagesToStorage = (destination) => {
  return {
    storage: diskStorage({
      destination: `./uploads/${destination}`,
      filename: (req, file, callback) => {
        const fileExtension: string = path.extname(file.originalname);
        const filename: string = uuidv4() + fileExtension;
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      validMimeType.includes(file.mimetype)
        ? callback(null, true)
        : callback(null, false);
    },
  };
};

const logger = new Logger('IMAGES');

//! Update file function
export const removeFile = (fullFilePath: string) => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (e) {
    logger.error(e);
  }
};
