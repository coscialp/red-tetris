import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import Player from "../logics/Player";
import Game from "../logics/Game";
import { PieceFactory } from "../logics/factory";

@WebSocketGateway(3001, { transports: ["websocket"] })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Socket;
  private _rooms: Map<string, string> = new Map();
  private _clients: Map<string, Player> = new Map();

  handleConnection(@ConnectedSocket() socket: Socket): void {
    console.log("Client connected with id: ", socket.id);
    console.debug(this._clients.size);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    this._clients.delete(socket.id);
    console.log("Client disconnected with id: ", socket.id);
  }

  @SubscribeMessage("getOwnerByRoomName")
  handleGetRoomByOwner(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    const owner = this._rooms.get(body.room);
    socket.emit("owner", { owner: owner });
  }

  @SubscribeMessage("join")
  handleJoinGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ): void {
    if (!this._rooms.has(body.room)) {
      this._rooms.set(body.room, body.username);
    }
    this._clients.set(socket.id, new Player(body.username, socket, body.room));
    console.log(`Client ${body.username} joined game with id: ${body.room}`);
  }

  private sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  private emitPreviewBoard = (player: Player) => {
    const previewString = player.game.previewBoard.map((row) =>
      row.map((cell) => {
        let colorString = cell.toString(16);
        while (colorString.length < 8) {
          colorString = "0" + colorString;
        }
        return colorString;
      }),
    );

    player.socket.emit("previewBoard", {
      board: previewString,
    });
  };

  @SubscribeMessage("startGame")
  async handleStartGame(@ConnectedSocket() socket: Socket): Promise<void> {
    const currentPlayer = this._clients.get(socket.id);
    if (!currentPlayer) {
      throw new Error("Player not found");
    }
    if (!this._rooms.has(currentPlayer.room)) {
      throw new Error("Room not found");
    }

    if (this._rooms.get(currentPlayer.room) !== currentPlayer.name) {
      throw new Error("You are not the owner of the room");
    }

    let players = Array.from(this._clients.values()).filter(
      (player) => player.room === currentPlayer.room,
    );
    players.forEach((player) =>
      player.startGame(
        new Game(
          PieceFactory.createRandomPiece(),
          PieceFactory.createRandomPiece(),
        ),
      ),
    );
    while (true) {
      for (const player of players) {
        if (player.game.nextPiece === null) {
          player.game.nextPiece = PieceFactory.createRandomPiece();
        }
        if (player.game.isGameOver()) {
          player.socket.emit("gameOver");
          players = players.filter((p) => p.name !== player.name);
        }
      }

      if (players.length === 0) {
        return;
      }

      players.forEach((player) => {
        this.emitPreviewBoard(player);
      });

      players.forEach((player) => player.game.moveDown());
      await this.sleep(500);
    }
  }

  @SubscribeMessage("rotate")
  handleRotate(@ConnectedSocket() socket: Socket): void {
    const player = this._clients.get(socket.id);

    if (!player) {
      throw new Error("Player not found");
    }

    if (!player.game) {
      throw new Error("Player not in game");
    }
    player.game.rotate();
    this.emitPreviewBoard(player);
  }

  @SubscribeMessage("moveLeft")
  handleMoveLeft(@ConnectedSocket() socket: Socket): void {
    const player = this._clients.get(socket.id);

    if (!player) {
      throw new Error("Player not found");
    }

    if (!player.game) {
      throw new Error("Player not in game");
    }
    player.game.moveLeft();
    this.emitPreviewBoard(player);
  }

  @SubscribeMessage("moveRight")
  handleMoveRight(@ConnectedSocket() socket: Socket): void {
    const player = this._clients.get(socket.id);

    if (!player) {
      throw new Error("Player not found");
    }

    if (!player.game) {
      throw new Error("Player not in game");
    }
    player.game.moveRight();
    this.emitPreviewBoard(player);
  }

  @SubscribeMessage("moveDown")
  handleMoveDown(@ConnectedSocket() socket: Socket): void {
    const player = this._clients.get(socket.id);

    if (!player) {
      throw new Error("Player not found");
    }

    if (!player.game) {
      throw new Error("Player not in game");
    }
    player.game.moveDown();
    this.emitPreviewBoard(player);
  }

  @SubscribeMessage("drop")
  handleDrop(@ConnectedSocket() socket: Socket): void {
    const player = this._clients.get(socket.id);

    if (!player) {
      throw new Error("Player not found");
    }

    if (!player.game) {
      throw new Error("Player not in game");
    }
    player.game.drop();
    this.emitPreviewBoard(player);
  }

  @SubscribeMessage("increaseUnavailableLines")
  handleIncreaseUnavailableLines(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ): void {
    const players = Array.from(this._clients.values()).filter(
      (player) => player.room === body.room,
    );

    players.forEach((player) => {
      if (player.name !== this._clients.get(socket.id).name) {
        player.game.increaseUnavailableLines();
        this.emitPreviewBoard(player);
      }
    });
  }
}
