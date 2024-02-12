import { WebSocketGateway, OnGatewayConnection, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(3001, { transports: ["websocket"]})
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor() {
    console.log("hello there");
  }

  handleConnection(@ConnectedSocket() socket: Socket): void {
    console.log("HERE");
  }

  // Implement other Socket.IO event handlers and message handlers
}
