import Game from "./Game";
import { Socket } from "socket.io";

class Player {
  private _game?: Game;
  private readonly _room: string;
  private readonly _name: string;
  private readonly _socket: Socket;

  constructor(name: string, socket: Socket, room: string) {
    this._name = name;
    this._room = room;
    this._socket = socket;
  }

  public get name() {
    return this._name;
  }

  public get game() {
    return this._game;
  }

  public startGame(game: Game) {
    if (this._game) {
      throw new Error("Player already in game");
    }
    this._game = game;
  }

  public endGame() {
    this._game = undefined;
  }

  public get socket() {
    return this._socket;
  }

  public get room() {
    return this._room;
  }
}

export default Player;
