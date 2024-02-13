import Game from "./Game";
import { BluePiece, CyanPiece, YellowPiece } from "./VariantPiece";
import {
  boardWithBluePiece,
  boardWithBluePieceAndOneRotation,
  boardWithBluePieceWithOneLeftMove,
  boardWithBluePieceWithOneRightMove,
  boardWithOneClearedLine,
  emptyBoard,
  twoDropLines,
} from "./examples_board";

describe("Game", () => {
  it("should have an empty board at creation", () => {
    const game = new Game(new BluePiece(), new BluePiece());
    game.printBoard();
    expect(game.visualBoard).toEqual(emptyBoard);
  });
  it("should be able to drop a piece", () => {
    const game = new Game(new BluePiece(), new BluePiece());
    game.drop();
    expect(game.visualBoard).toEqual(boardWithBluePiece);
  });
  it("should be able to rotate a piece", () => {
    const game = new Game(new BluePiece(), new BluePiece());
    game.rotate();
    game.drop();
    expect(game.visualBoard).toEqual(boardWithBluePieceAndOneRotation);
  });
  it("should be able to move a piece left", () => {
    const game = new Game(new BluePiece(), new BluePiece());
    game.moveLeft();
    game.drop();
    expect(game.visualBoard).toEqual(boardWithBluePieceWithOneLeftMove);
  });
  it("should be able to move a piece right", () => {
    const game = new Game(new BluePiece(), new BluePiece());
    game.moveRight();
    game.drop();
    expect(game.visualBoard).toEqual(boardWithBluePieceWithOneRightMove);
  });
  it("should be able to drop 2 pieces", () => {
    const game = new Game(new CyanPiece(), new CyanPiece());
    game.drop();
    game.nextPiece = new BluePiece();
    game.drop();
    game.printBoard();
    expect(game.visualBoard).toEqual(twoDropLines);
  });
  it("should be able to clear a line", () => {
    const game = new Game(new CyanPiece(), new CyanPiece());
    game.moveLeft();
    game.moveLeft();
    game.moveLeft();
    game.moveLeft();
    game.drop();
    game.nextPiece = new YellowPiece();
    game.drop();
    game.nextPiece = new CyanPiece();
    game.moveRight();
    game.moveRight();
    game.moveRight();
    game.moveRight();
    game.drop();
    game.printBoard();
    expect(game.visualBoard).toEqual(boardWithOneClearedLine);
  });
});
