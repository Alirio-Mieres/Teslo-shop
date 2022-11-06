import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  
  constructor(private readonly messagesWsService: MessagesWsService) {}
  
  handleConnection( client: Socket ) {
    // console.log('Cliente conectado:', client.id);
    this.messagesWsService.registerClient( client );


  }
  handleDisconnect( client: Socket ) {
    // console.log('Client desconectado:', client.id)
    this.messagesWsService.removeClient( client.id );

  }
}
