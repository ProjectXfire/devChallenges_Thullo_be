import { Test, TestingModule } from '@nestjs/testing';
import { BoardPermissionController } from './board-permission.controller';

describe('BoardPermissionController', () => {
  let controller: BoardPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardPermissionController],
    }).compile();

    controller = module.get<BoardPermissionController>(BoardPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
