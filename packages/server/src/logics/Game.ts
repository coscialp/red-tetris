import { Piece } from "./Piece";
import Position from "./Position";

class Game {
  private _board: bigint[][] = Array(20)
    .fill(0)
    .map(() => Array(10).fill(0x0n));
  private _currentPiece: Piece;
  private _nextPiece: Piece | null = null;
  private _currentPiecePosition: Position;
  private _numberOfUnavailableLines: number = 0;

  constructor(currentPiece: Piece, nextPiece: Piece) {
    this._currentPiecePosition = this.defaultPiecePosition();
    this._currentPiece = currentPiece;
    this._nextPiece = nextPiece;
  }

  private defaultPiecePosition = () => {
    return { x: 4, y: this._numberOfUnavailableLines - 1 };
  };

  public get board() {
    return this._board;
  }

  public get nextPiece() {
    return this._nextPiece;
  }

  public set nextPiece(piece: Piece) {
    this._nextPiece = piece;
  }

  public get piecePositions(): Position[] {
    return this._currentPiece.position.map((position) => ({
      x: position.x + this._currentPiecePosition.x,
      y: position.y + this._currentPiecePosition.y,
    }));
  }

  public isValidPositions = (position: Position[]): boolean => {
    return position.every(
      (position) =>
        position.x >= 0 &&
        position.x < 10 &&
        position.y < 20 &&
        (position.y < 0 || this._board[position.y][position.x] === 0x0n),
    );
  };

  public rotate = () => {
    const nextRotation = this._currentPiece.nextRotation;
    if (this.isValidPositions(nextRotation)) {
      this._currentPiece.rotate();
    }
  };

  public moveLeft = () => {
    const nextPosition = this.piecePositions.map((position) => ({
      x: position.x - 1,
      y: position.y,
    }));
    if (this.isValidPositions(nextPosition)) {
      this._currentPiecePosition.x -= 1;
    }
  };

  public moveRight = () => {
    const nextPosition = this.piecePositions.map((position) => ({
      x: position.x + 1,
      y: position.y,
    }));
    if (this.isValidPositions(nextPosition)) {
      this._currentPiecePosition.x += 1;
    }
  };

  public moveDown = () => {
    const nextPosition = this.piecePositions.map((position) => ({
      x: position.x,
      y: position.y + 1,
    }));
    if (this.isValidPositions(nextPosition)) {
      this._currentPiecePosition.y += 1;
    } else {
      this.placePiece();
    }
  };

  public placePiece = () => {
    this.piecePositions.forEach((position) => {
      this._board[position.y][position.x] = this._currentPiece.color;
    });
    this._currentPiece = this._nextPiece!;
    this._nextPiece = null;
    this._currentPiecePosition = this.defaultPiecePosition();
    this.clearLines();
  };

  public drop = () => {
    let nextPosition = this.piecePositions.map((position) => ({
      x: position.x,
      y: position.y + 1,
    }));
    while (this.isValidPositions(nextPosition)) {
      this._currentPiecePosition.y += 1;
      nextPosition = this.piecePositions.map((position) => ({
        x: position.x,
        y: position.y + 1,
      }));
    }
    this.placePiece();
  };

  public increaseUnavailableLines = () => {
    this._numberOfUnavailableLines += 1;
    this._board = this._board.map((row, index) => {
      if (index < this._numberOfUnavailableLines) {
        return row.map((cell) => {
          if (cell !== 0x0n) {
            throw new Error("Game Over");
          }
          return 0x646464d9n;
        });
      }
      return row;
    });
  };

  public clearLines = () => {
    const lines = this._board.reduce((acc, row, index) => {
      if (row.every((cell) => cell !== 0x0n)) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);

    lines.forEach((line) => {
      this._board.splice(line, 1);
      this._board.unshift(Array(10).fill(0x0n));
    });
  };

  public isGameOver = (): boolean => {
    return !this.isValidPositions(this.piecePositions);
  };

  public get spectra() {
    let currentSpectra = this.piecePositions.map((position) => ({
      x: position.x,
      y: position.y,
    }));
    let nextPosition = currentSpectra.map((position) => ({
      ...position,
      y: position.y + 1,
    }));
    while (this.isValidPositions(nextPosition)) {
      currentSpectra = nextPosition;
      nextPosition = nextPosition.map((position) => ({
        x: position.x,
        y: position.y + 1,
      }));
    }
    return currentSpectra;
  }

  public get previewBoard() {
    const previewBoard = this._board.map((row) => row.map((cell) => cell));
    this.spectra.forEach((position) => {
      previewBoard[position.y][position.x] =
        this._currentPiece.color - BigInt(200);
    });
    this.piecePositions.forEach((position) => {
      if (position.y >= 0) {
        previewBoard[position.y][position.x] = this._currentPiece.color;
      }
    });
    return previewBoard;
  }

  public get visualBoard() {
    return this._board
      .map((row) => row.map((cell) => (cell === 0x0n ? "." : "X")).join(""))
      .join("\n");
  }

  public printBoard = () => {
    console.log(this.visualBoard);
  };
}

export default Game;
