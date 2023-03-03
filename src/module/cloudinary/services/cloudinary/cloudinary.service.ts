import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  async destroyImage(imageId: string) {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(
        imageId,
        { resource_type: 'image' },
        (error, result) => {
          if (error) {
            reject();
          }
          resolve(result);
        },
      );
    });
  }

  async upload(file: Express.Multer.File) {
    const uploadedImage = await this.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
    return {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    };
  }
}
