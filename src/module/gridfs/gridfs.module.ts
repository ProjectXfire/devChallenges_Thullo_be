import { Module } from '@nestjs/common';
// Modules
import { MulterModule } from '@nestjs/platform-express';
// Multer config
import { GridfsMulterConfigService } from './services/gridfs-multer-config.service';
// Controllers
import { FilesController } from './controllers/files.controller';
// Services
import { FilesService } from './services/files.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: GridfsMulterConfigService,
    }),
  ],
  controllers: [FilesController],
  providers: [GridfsMulterConfigService, FilesService],
})
export class GridfsModule {}
