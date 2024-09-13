import { OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UsuariosService } from 'src/auth/usuarios/usuarios.service';
import { ParcelasEventEmitter } from './event-emitter.service';

/**
 * @description
 * Install npm i @nestjs/platform-socket.io socket.io @nestjs/websockets
 */
@WebSocketGateway({
  namespace: 'ingresos',
  cors: {
    origin: '*',
  },
})
export class ParcelasGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private readonly auth: AuthService,
    private readonly service: UsuariosService,
    private readonly emitter: ParcelasEventEmitter,
  ) {
    emitter.emitter.on('new-ingreso', (ingreso) => {
      this.server.emit('new-ingreso', JSON.stringify(ingreso));
    });

    emitter.emitter.on('update-ingreso', (ingreso) => {
      this.server.emit('update-ingreso', JSON.stringify(ingreso));
    });
  }

  @WebSocketServer() server: Server;

  /**
   * @description Connected sockets (IRL)
   */
  sockets: Socket[] = [];

  /**
   * @description
   * Manejo de conexiones
   */
  async handleConnection(socket: Socket, ...args: any[]) {
    try {
      console.log('establishing connection');
      console.log('Connected Socket ' + socket);
      const user = await this.getUserAndAuthenticate(socket);
      if (!user) {
        console.log('Error:', 'Unauthorized');
        return socket.disconnect();
      }
      //* Pusheamos los sockets abiertos
      this.sockets.push(socket);
    } catch (e: any) {
      console.error(new Date(), e);
      return socket.disconnect();
    }
  }
  /**
   * @description
   * Manejo de desconexiones
   */
  handleDisconnect(socket: Socket) {
    try {
      console.log('finish connection');
      // Delete the disconnected socket (disconnect)
      this.sockets = this.sockets.filter((s) => s.id !== socket.id);
    } catch (e: any) {
      console.log('User disconnected:', e.message);
    }
  }

  onModuleInit() {
    // throw new Error('Method not implemented.');
  }

  /**
   * @description Return the user from the database (if exist)
   * @param socket socket of the user connected
   * @returns user entity or null
   */
  private async getUserAndAuthenticate(socket: Socket) {
    const decodedToken = await this.auth.verifyJwt(
      socket.handshake.headers.authorization,
    );
    return decodedToken
      ? await this.service.getUserInfo(decodedToken.username)
      : null;
  }
}
