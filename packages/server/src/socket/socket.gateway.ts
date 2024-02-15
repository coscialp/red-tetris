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
import { Piece } from "src/logics/Piece";

@WebSocketGateway(3001, { transports: ["websocket"] })
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
    console.debug(this._clients.size);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    this._clients.delete(socket.id);
    console.log("Client disconnected with id: ", socket.id);
    this._rooms.forEach((room, key) => {
      let nbPlayers = 0;
      this._clients.forEach((player) => {
        if (player.room === key) {
          nbPlayers++;
        }
      });
      if (nbPlayers === 0) {
        this._rooms.delete(key);
      }
    });
  }

  @SubscribeMessage("getOwnerByRoomName")
  handleGetRoomByOwner(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    const owner = this._rooms.get(body.room).owner;
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
        pieces: PieceFactory.createBagPieces(),
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
      }
    }
    if (isValid)
      this._clients.set(
        socket.id,
        new Player(body.username, socket, body.room),
      );
    console.log(`Client ${body.username} joined game with id: ${body.room}`);
  }

  private sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  private increaseUnavailableLines = (
    players: Player[],
    nbLinesCleared: number,
  ) => {
    while (nbLinesCleared > 0) {
      console.log(
        "players",
        players.map((p) => p.name),
      );
      players.forEach((player: Player) => {
        try {
          console.log("player " + player.name + " unavailableLines++");
          player.game.increaseUnavailableLines();
        } catch (error) {
          console.error(error);
        }
      });
      nbLinesCleared--;
    }
  };

  emitPreviewBoard = (player: Player) => {
    const previewString = player.game.previewBoard.map((row) =>
      row.map((cell) => {
        console.log(cell);
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

    if (this._rooms.get(currentPlayer.room).owner !== currentPlayer.name) {
      throw new Error("You are not the owner of the room");
    }

    if (this._rooms.get(currentPlayer.room).status === "playing") {
      throw new Error("Game already started, please wait");
    }

    this._rooms.get(currentPlayer.room).status = "playing";
    let players = Array.from(this._clients.values()).filter(
      (player) => player.room === currentPlayer.room,
    );
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
    while (true) {
      const mapBoard = [];
      if (players.length === 0) {
        this._rooms.get(currentPlayer.room).status = "waiting";
        return;
      }
      for (const player of players) {
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
          player.game.nbPiecePlaced >=
          this._rooms.get(currentPlayer.room).pieces.length / 2
        ) {
          this._rooms.get(currentPlayer.room).pieces = this._rooms
            .get(currentPlayer.room)
            .pieces.concat(PieceFactory.createBagPieces());
        }
        mapBoard.push({ name: player.name, map: previewString });
      }
      let playerToRemove: Player = null;
      for (const player of players) {
        if (player.game.nextPiece === null) {
          player.game.nextPiece = this._rooms.get(currentPlayer.room).pieces[
            player.game.nbPiecePlaced + 2
          ];
          player.game.nextPieceArray;
          player.socket.emit("nextPiece", {
            nextPiece: player.game.nextPiece.nextPiecePreview,
          });
        }
        if (player.game.isGameOver() && players.length === 1) {
          player.socket.emit("winner");
          playerToRemove = player;
        } else if (player.game.isGameOver()) {
          player.socket.emit("gameOver");
          playerToRemove = player;
        }
        player.socket.emit("spectraBoard", mapBoard);
      }
      if (playerToRemove) {
        playerToRemove.endGame();
        players = players.filter((p) => p.name !== playerToRemove.name);
      }

      if (players.length === 0) {
        return;
      }

      players.forEach((player) => {
        this.emitPreviewBoard(player);
      });

      players.forEach((player) => {
        const nbLinesCleared = player.game.moveDown();
        if (nbLinesCleared > 0) {
          console.log("player " + player.name + " send unavailableLines");
        }
        this.increaseUnavailableLines(
          players.filter((p) => p.name !== player.name),
          nbLinesCleared,
        );
      });
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
    const nbLinesCleared = player.game.moveDown();
    if (nbLinesCleared > 0) {
      console.log("player " + player.name + " send unavailableLines");
    }
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
      throw new Error("Player not found");
    }

    if (!player.game) {
      throw new Error("Player not in game");
    }
    const nbLinesCleared = player.game.drop();
    if (nbLinesCleared > 0) {
      console.log("player " + player.name + " send unavailableLines");
    }
    this.increaseUnavailableLines(
      Array.from(this._clients.values()).filter(
        (p) => p.room === player.room && p.name !== player.name,
      ),
      nbLinesCleared,
    );
    this.emitPreviewBoard(player);
  }
}
