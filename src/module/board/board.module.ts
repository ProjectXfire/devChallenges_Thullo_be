import { Module } from '@nestjs/common';
// Providers
import { MongooseModule } from '@nestjs/mongoose';
// Models
import { Board, BoardSchema } from './models/board.entity';
import { TaskList, TaskListSchema } from './models/list.entity';
import { Task, TaskSchema } from './models/task.entity';
import { Label, LabelSchema } from './models/label.entity';
import { Comment, CommentSchema } from './models/comment.entity';
import { Attachment, AttachmentSchema } from './models/attachment.entity';
import {
  BoardPermission,
  BoardPermissionSchema,
} from './models/board.permission.entity';
// Modules
import { UserModule } from '@module/user/user.module';
import { CloudinaryModule } from '@module/cloudinary/cloudinary.module';
// Controllers
import { BoardController } from './controllers/board/board.controller';
import { ListController } from './controllers/list/list.controller';
import { TaskController } from './controllers/task/task.controller';
import { LabelController } from './controllers/label/label.controller';
import { CommentController } from './controllers/comment/comment.controller';
import { BoardPermissionController } from './controllers/board-permission/board-permission.controller';
// Services
import { BoardService } from './services/board/board.service';
import { ListService } from './services/list/list.service';
import { TaskService } from './services/task/task.service';
import { LabelService } from './services/label/label.service';
import { CommentService } from './services/comment/comment.service';
import { AttachmentController } from './controllers/attachment/attachment.controller';
import { AttachmentService } from './services/attachment/attachment.service';
import { BoardPermissionService } from './services/board-permission/board-permission.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Board.name,
        schema: BoardSchema,
      },
      {
        name: Task.name,
        schema: TaskSchema,
      },
      {
        name: TaskList.name,
        schema: TaskListSchema,
      },
      {
        name: Label.name,
        schema: LabelSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: Attachment.name,
        schema: AttachmentSchema,
      },
      {
        name: BoardPermission.name,
        schema: BoardPermissionSchema,
      },
    ]),
    UserModule,
    CloudinaryModule,
  ],
  providers: [
    BoardService,
    ListService,
    TaskService,
    LabelService,
    CommentService,
    AttachmentService,
    BoardPermissionService,
  ],
  controllers: [
    BoardController,
    ListController,
    TaskController,
    LabelController,
    CommentController,
    AttachmentController,
    BoardPermissionController,
  ],
  exports: [ListService],
})
export class BoardModule {}
