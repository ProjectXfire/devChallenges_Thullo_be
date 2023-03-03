import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { Connection } from 'mongoose';

@Injectable()
export class FilesService {
  private fileModel: MongoGridFS;

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.fileModel = new MongoGridFS(this.connection.db, 'fs');
  }

  async readStream(id: string) {
    try {
      return await this.fileModel.readFileStream(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findInfo(id: string) {
    try {
      const file = await this.fileModel.findById(id);
      return {
        filename: file.filename,
        length: file.length,
        chunkSize: file.chunkSize,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteFile(id: string) {
    try {
      const fileInfo = await this.findInfo(id);
      const fileStream = await this.fileModel.delete(id);
      return {
        fileInfo,
        fileStream,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
