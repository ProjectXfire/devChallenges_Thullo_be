import { Test, TestingModule } from '@nestjs/testing';
import { GridfsMulterConfigService } from './gridfs-multer-config.service';

describe('GridfsMulterConfigService', () => {
  let service: GridfsMulterConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GridfsMulterConfigService],
    }).compile();

    service = module.get<GridfsMulterConfigService>(GridfsMulterConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
