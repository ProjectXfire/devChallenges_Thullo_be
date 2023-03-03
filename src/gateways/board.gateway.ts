import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
// Services
import { ListService } from '@module/board/services/list/list.service';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private listService: ListService) {}

  private logger: Logger = new Logger('BoardGateway');

  afterInit(server: Socket) {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    client.on('board', (boardId) => {
      client.join(boardId);
    });
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('listsByBoard')
  async handleUserMessage(client: Socket, boardId: string): Promise<void> {
    try {
      const listsByBoard = await this.listService.getAllByBoard(boardId);
      this.server.to(boardId).emit('listsByBoard', listsByBoard);
    } catch (error) {
      throw new InternalServerErrorException('Error on socked');
    }
  }
}
