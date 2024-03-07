import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import Player from "../logics/Player";
import Game from "../logics/Game";
import { PieceFactory } from "../logics/factory";
import { Piece } from "src/logics/Piece";

import {
  ArgumentsHost,
  Catch,
  HttpException,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const socket = host.switchToWs().getClient() as Socket;
    const error =
      exception instanceof WsException
        ? exception.getError()
        : exception.getResponse();
    const details = error instanceof Object ? { ...error } : { message: error };
    console.log("Error: ", details);
    socket.emit("error", {
      error: {
        details,
      },
    });
  }
}

@WebSocketGateway(3001, { transports: ["websocket"] })
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Socket;
  private _rooms: Map<
    string,
    { owner: string; pieces: Piece[]; status: string }
  > = new Map();
  private _clients: Map<string, Player> = new Map();

  handleConnection(@ConnectedSocket() socket: Socket): void {
    console.log("Client connected with id: ", socket.id);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    this._clients.delete(socket.id);
    console.log("Client disconnected with id: ", socket.id);
    this._rooms.forEach((room, key) => {
      let nbPlayers = 0;
      let ownerIsConnected: boolean = false;
      this._clients.forEach((player) => {
        if (room.owner === player.name) {
          ownerIsConnected = true;
        }
        if (player.room === key) {
          nbPlayers++;
        }
      });
      if (nbPlayers === 0) {
        this._rooms.delete(key);
      } else if (!ownerIsConnected) {
        const newOwner = Array.from(this._clients.values()).filter(
          (player) => player.room === key,
        )[0];
        room.owner = newOwner.name;
        newOwner.socket.emit("newOwner", { owner: room.owner });
      }
    });
  }

  @SubscribeMessage("getOwnerByRoomName")
  handleGetRoomByOwner(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    const owner = this._rooms.get(body).owner;
    socket.emit("owner", { owner: owner });
  }

  @SubscribeMessage("join")
  handleJoinGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ): void {
    let isValid = true;
    if (!this._rooms.has(body.room)) {
      this._rooms.set(body.room, {
        owner: body.username,
        pieces: [],
        status: "waiting",
      });
    }

    const players = Array.from(this._clients.values()).filter(
      (player) => player.room === body.room,
    );
    for (const player of players) {
      if (player.name === body.username) {
        isValid = false;
        console.log(
          `Client ${body.username} can't join a user with same username is already in game`,
        );
        throw new WsException("Username already in use");
      }
    }
    if (isValid) {
      this._clients.set(
        socket.id,
        new Player(body.username, socket, body.room),
      );
      console.log(`Client ${body.username} joined game with id: ${body.room}`);
      socket.emit("joined", { room: this._rooms.get(body.room) });
    }

    if (this._rooms.get(body.room).status === "playing") {
      throw new WsException("Game already started, please wait");
    }
  }

  private sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  private increaseUnavailableLines = (
    players: Player[],
    nbLinesCleared: number,
  ) => {
    while (nbLinesCleared - 1 > 0) {
      players.forEach((player: Player) => {
        try {
          player.game.increaseUnavailableLines();
        } catch (error) {
          /* Do nothing */
          console.debug("Game over for " + player.name);
        }
      });
      nbLinesCleared--;
    }
  };

  emitPreviewBoard = (player: Player) => {
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

  @SubscribeMessage("getGameStatus")
  handleGetGameStatus(@ConnectedSocket() socket: Socket): void {
    const player = this._clients.get(socket.id);
    try {
      socket.emit("gameStatus", {
        status: this._rooms.get(player.room).status,
      });
    } catch (error) {
      socket.emit("gameStatus", {
        status: "waiting",
      });
    }
  }

  @SubscribeMessage("startGame")
  async handleStartGame(@ConnectedSocket() socket: Socket): Promise<void> {
    const currentPlayer = this._clients.get(socket.id);
    if (!currentPlayer) {
      throw new WsException("Player not found");
    }
    if (!this._rooms.has(currentPlayer.room)) {
      throw new WsException("Room not found");
    }

    if (this._rooms.get(currentPlayer.room).owner !== currentPlayer.name) {
      throw new WsException("You are not the owner of the room");
    }

    this._rooms.get(currentPlayer.room).pieces = PieceFactory.createBagPieces();

    this._rooms.get(currentPlayer.room).status = "playing";

    let players = Array.from(this._clients.values()).filter(
      (player) => player.room === currentPlayer.room,
    );
    const isSoloGame = players.length === 1;
    players.forEach((player) => {
      player.startGame(
        new Game(
          this._rooms.get(currentPlayer.room).pieces[0],
          this._rooms.get(currentPlayer.room).pieces[1],
        ),
      );
      player.socket.emit("nextPiece", {
        nextPiece: player.game.nextPiece.nextPiecePreview,
      });
    });
    console.log(
      "Game started with players: ",
      players.map((p) => p.name),
    );
    while (true) {
      if (players.length === 0) {
        socket.emit("gameFinished");
        try {
          this._rooms.get(currentPlayer.room).status = "waiting";
        } catch {
          /* Do nothing */
        }
        console.log("Game finished");
        return;
      }
      const mapBoard = [];
      for (const player of players) {
        if (!this._clients.has(player.socket.id)) {
          players = players.filter((p) => p.name !== player.name);
          continue;
        }
        let playerToRemove: Player = null;
        const previewString = player.game.spectra.map((row) =>
          row.map((cell) => {
            let colorString = cell.toString(16);
            while (colorString.length < 8) {
              colorString = "0" + colorString;
            }
            return colorString;
          }),
        );
        if (
          this._rooms.get(currentPlayer.room).pieces &&
          player.game.nbPiecePlaced >=
            this._rooms.get(currentPlayer.room).pieces.length / 2
        ) {
          this._rooms.get(currentPlayer.room).pieces = this._rooms
            .get(currentPlayer.room)
            .pieces.concat(PieceFactory.createBagPieces());
        }
        mapBoard.push({ name: player.name, map: previewString });

        if (player.game.nextPiece === null) {
          player.game.nextPiece = this._rooms.get(currentPlayer.room).pieces[
            player.game.nbPiecePlaced + 1
          ];
          player.game.nextPieceArray;
          player.socket.emit("nextPiece", {
            nextPiece: player.game.nextPiece.nextPiecePreview,
          });
        }
        if (player.game.isGameOver()) {
          player.socket.emit("gameOver");
          playerToRemove = player;
        }

        if (!isSoloGame && players.length === 1) {
          players[0].socket.emit("winner");
          players[0].endGame();
          console.log(
            "Player " + players[0].name + " is the winner of the game",
          );
          players = players.filter((p) => p.name !== players[0].name);
          continue;
        }

        if (playerToRemove) {
          playerToRemove.endGame();
          console.log("Player " + playerToRemove.name + " is out of the game");
          players = players.filter((p) => p.name !== playerToRemove.name);
          continue;
        }

        this.emitPreviewBoard(player);
        const nbLinesCleared = player.game.moveDown();
        this.increaseUnavailableLines(
          players.filter((p) => p.name !== player.name),
          nbLinesCleared,
        );
      }
      players.forEach((player) => {
        player.socket.emit("spectraBoard", mapBoard);
      });
      await this.sleep(1000);
    }
  }

  @SubscribeMessage("rotate")
  handleRotate(@ConnectedSocket() socket: Socket): void {
    const player = this._clients.get(socket.id);

    if (!player) {
      throw new WsException("Player not found");
    }

    if (!player.game) {
      throw new WsException("Player not in game");
    }
    player.game.rotate();
    this.emitPreviewBoard(player);
  }

  @SubscribeMessage("moveLeft")
  handleMoveLeft(@ConnectedSocket() socket: Socket): void {
    const player = this._clients.get(socket.id);

    if (!player) {
      throw new WsException("Player not found");
    }

    if (!player.game) {
      throw new WsException("Player not in game");
    }
    player.game.moveLeft();
    this.emitPreviewBoard(player);
  }

  @SubscribeMessage("moveRight")
  handleMoveRight(@ConnectedSocket() socket: Socket): void {
    const player = this._clients.get(socket.id);

    if (!player) {
      throw new WsException("Player not found");
    }

    if (!player.game) {
      throw new WsException("Player not in game");
    }
    player.game.moveRight();
    this.emitPreviewBoard(player);
  }

  @SubscribeMessage("moveDown")
  handleMoveDown(@ConnectedSocket() socket: Socket): void {
    const player = this._clients.get(socket.id);

    if (!player) {
      throw new WsException("Player not found");
    }

    if (!player.game) {
      throw new WsException("Player not in game");
    }
    const nbLinesCleared = player.game.moveDown();
    this.increaseUnavailableLines(
      Array.from(this._clients.values()).filter(
        (p) => p.room === player.room && p.name !== player.name,
      ),
      nbLinesCleared,
    );
    this.emitPreviewBoard(player);
  }

  @SubscribeMessage("drop")
  handleDrop(@ConnectedSocket() socket: Socket): void {
    const player = this._clients.get(socket.id);

    if (!player) {
      throw new WsException("Player not found");
    }

    if (!player.game) {
      throw new WsException("Player not in game");
    }

    const nbLinesCleared = player.game.drop();
    this.increaseUnavailableLines(
      Array.from(this._clients.values()).filter(
        (p) => p.room === player.room && p.name !== player.name,
      ),
      nbLinesCleared,
    );
    this.emitPreviewBoard(player);
  }
}
