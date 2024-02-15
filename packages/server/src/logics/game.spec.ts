import Game from "./Game";
import { BluePiece, CyanPiece, YellowPiece } from "./VariantPiece";
import {
  boardWithBluePiece,
  boardWithBluePieceAndOneRotation,
  boardWithBluePieceOneMoveDown,
  boardWithBluePieceWithOneLeftMove,
  boardWithBluePieceWithOneRightMove,
  boardWithOneClearedLine,
  emptyBoard,
  twoDropLines,
} from "./examples_board";
import { PieceFactory } from "./factory";

describe("Game", () => {
  it("should have an empty board at creation", () => {
    const game = new Game(new BluePiece(), new BluePiece());
    game.printBoard();
    expect(game.visualBoard).toEqual(emptyBoard);
  });
  it("should be able to get the next piece", () => {
    const game = new Game(new BluePiece(), new BluePiece());
    expect(game.nextPiece).toBeInstanceOf(BluePiece);
  });
  it("should be able to get the board", () => {
    const game = new Game(new BluePiece(), new BluePiece());
    expect(game.board).toBeDefined();
  });
  it("should be able to drop a piece", () => {
    const game = new Game(new BluePiece(), new BluePiece());
    game.drop();
    expect(game.visualBoard).toEqual(boardWithBluePiece);
  });
  it("should be able to move a piece down", () => {
    const game = new Game(new BluePiece(), new BluePiece());
    game.moveDown();
    expect(game.visualPreviewBoard).toEqual(boardWithBluePieceOneMoveDown);
  });
  it("should be able to place piece when it can't move down", () => {
    const game = new Game(new BluePiece(), new BluePiece());
    for (let i = 0; i < 20; i++) {
      game.moveDown();
    }
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
    expect(game.visualBoard).toEqual(boardWithOneClearedLine);
  });
  it("should be able to detect game over", () => {
    const game = new Game(new CyanPiece(), new CyanPiece());
    for (let i = 0; i < 20; i++) {
      game.nextPiece = PieceFactory.createRandomPiece();
      game.drop();
    }
    expect(game.isGameOver()).toBeTruthy();
  });
  it("should be able to increase the unavailable lines", () => {
    const game = new Game(new YellowPiece(), new CyanPiece());
    game.moveDown();
    game.increaseUnavailableLines();
    try {
      game.increaseUnavailableLines();
    } catch (error) {
      expect(error).toEqual(new Error("Game Over"));
    }
  });
  it("should return a empty list if no current piece", () => {
    const game = new Game(new BluePiece(), new BluePiece());
    game.drop();
    game.drop();
    expect(game.piecePositions).toEqual([]);
  });
});
