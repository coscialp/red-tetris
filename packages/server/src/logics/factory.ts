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

  static createBagPieces(): Piece[] {
    const bag = [
      new CyanPiece(),
      new RedPiece(),
      new BluePiece(),
      new PurplePiece(),
      new OrangePiece(),
      new YellowPiece(),
      new GreenPiece(),
      new CyanPiece(),
      new RedPiece(),
      new BluePiece(),
      new PurplePiece(),
      new OrangePiece(),
      new YellowPiece(),
      new GreenPiece(),
    ];

    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }

    return bag;
  }
}

export { PieceFactory };
