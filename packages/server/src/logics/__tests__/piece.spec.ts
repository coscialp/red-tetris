import { Piece, pieceColors } from "../Piece";
import { PieceFactory } from "../factory";
import { BluePiece, CyanPiece } from "../VariantPiece";

describe("PieceFactory", () => {
  it("should create a cyan piece", () => {
    const piece = PieceFactory.create("cyan");
    expect(piece).toBeInstanceOf(CyanPiece);
  });
  it("should create a blue piece", () => {
    const piece = PieceFactory.create("blue");
    expect(piece).toBeInstanceOf(BluePiece);
  });
  it("should create random piece", () => {
    const piece = PieceFactory.createRandomPiece();
    expect(piece).toBeInstanceOf(Piece);
  });
  it("should throw error if color not implemented", () => {
    try {
      PieceFactory.create("not-implemented" as any);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  pieceColors.forEach((color) => {
    it("should have a next piece preview method", () => {
      const piece = PieceFactory.create(color);
      expect(piece.nextPiecePreview).toBeDefined();
    });
  });
});

describe("Piece", () => {
  it("should have 4 positions in each rotation", () => {
    const piece = PieceFactory.createRandomPiece();
    piece.rotations.forEach((rotation) => {
      expect(rotation).toHaveLength(4);
    });
  });
  it("should hexaColor work", () => {
    expect(Piece.hexaColor(new CyanPiece().color)).toEqual("00ffffff");
  });
  pieceColors.forEach((color) => {
    it(`should correctly rotate ${color} piece`, () => {
      const piece = PieceFactory.create(color);
      piece.rotations.forEach((rotation) => {
        expect(piece.position).toEqual(rotation);
        piece.rotate();
      });
    });
    it(`should have a good color for ${color} piece`, () => {
      const piece = PieceFactory.create(color);
      expect(piece.color).toBeDefined();
    });
  });
});
