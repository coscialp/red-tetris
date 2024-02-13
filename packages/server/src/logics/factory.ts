import { Piece, PieceColor, pieceColors } from "./Piece";
import {
  BluePiece,
  CyanPiece,
  GreenPiece,
  OrangePiece,
  PurplePiece,
  RedPiece,
  YellowPiece,
} from "./VariantPiece";

class PieceFactory {
  private static _constructorMap: { [key: string]: new () => Piece } = {
    cyan: CyanPiece,
    blue: BluePiece,
    red: RedPiece,
    yellow: YellowPiece,
    purple: PurplePiece,
    green: GreenPiece,
    orange: OrangePiece,
  };

  static create(color: PieceColor): Piece {
    try {
      return new PieceFactory._constructorMap[color]();
    } catch (e) {
      throw new Error(`Piece color: ${color} not implemented.`);
    }
  }

  static createRandomPiece(): Piece {
    const color = pieceColors[Math.floor(Math.random() * pieceColors.length)];
    return this.create(color);
  }
}

export { PieceFactory };
