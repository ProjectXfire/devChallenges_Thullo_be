import { Module } from '@nestjs/common';
// Providers
import { CloudinaryProvider } from './providers/cloudinary.provider';
// Services
import { CloudinaryService } from './services/cloudinary/cloudinary.service';

@Module({
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
