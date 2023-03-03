import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { GridFsStorage, DbTypes } from 'multer-gridfs-storage';

@Injectable()
export class GridfsMulterConfigService implements MulterOptionsFactory {
  gridFsStorage: any;
  constructor() {
    const connectionDb = {
      connection: process.env.MONGO_CONNECTION,
      user: process.env.MONGO_USERNAME,
      password: process.env.MONGO_PASSWORD,
      host: process.env.MONGO_HOST,
      name: process.env.MONGO_DB,
    };
    const { connection, user, password, host, name } = connectionDb;
    this.gridFsStorage = new GridFsStorage({
      url: `${connection}://${user}:${password}@${host}/${name}?retryWrites=true&w=majority`,
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          const filename = file.originalname.trim();
          const fileInfo = {
            filename: filename,
          };
          resolve(fileInfo);
        });
      },
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: this.gridFsStorage,
    };
  }
}
