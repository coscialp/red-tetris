import Player from "../Player";
import Game from "../Game";
import { PieceFactory } from "../factory";

describe("Player", () => {
  it("should create a player", () => {
    const player = new Player("player", {} as any, "room");
    expect(player).toBeDefined();
  });
  it("should get the name", () => {
    const player = new Player("player", {} as any, "room");
    expect(player.name).toEqual("player");
  });
  it("should get the room", () => {
    const player = new Player("player", {} as any, "room");
    expect(player.room).toEqual("room");
  });
  it("should get the game before start", () => {
    const player = new Player("player", {} as any, "room");
    expect(player.game).toBeUndefined();
  });
  it("should get the game after start", () => {
    const player = new Player("player", {} as any, "room");
    const game = new Game(
      PieceFactory.createRandomPiece(),
      PieceFactory.createRandomPiece(),
    );
    player.startGame(game);
    expect(player.game).toEqual(game);
  });
  it("should throw error if start game twice", () => {
    const player = new Player("player", {} as any, "room");
    const game = new Game(
      PieceFactory.createRandomPiece(),
      PieceFactory.createRandomPiece(),
    );
    player.startGame(game);
    try {
      player.startGame(game);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it("should get the socket", () => {
    const player = new Player("player", { id: "1" } as any, "room");
    expect(player.socket).toEqual({ id: "1" } as any);
  });
});
