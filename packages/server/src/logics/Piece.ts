import Position from "./Position";

const pieceColors = [
  "cyan",
  "blue",
  "red",
  "orange",
  "yellow",
  "green",
  "purple",
] as const;
type PieceColor = (typeof pieceColors)[number];

abstract class Piece {
  protected _rotation: number = 0;

  abstract get color(): bigint;
  abstract get rotations(): Position[][];

  get position(): Position[] {
    return this.rotations[this._rotation];
  }

  get nextRotation(): Position[] {
    return this.rotations[(this._rotation + 1) % this.rotations.length];
  }

  rotate = () => {
    this._rotation = (this._rotation + 1) % this.rotations.length;
  };
}

export { Piece, PieceColor, pieceColors };
