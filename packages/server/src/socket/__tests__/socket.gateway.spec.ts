import { Test, TestingModule } from "@nestjs/testing";
import { SocketGateway } from "../socket.gateway";
import { Socket } from "socket.io";

describe("SocketGateway", () => {
  let gateway: SocketGateway;
  let socketMock: jest.Mocked<Socket>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketGateway],
    }).compile();

    gateway = module.get<SocketGateway>(SocketGateway);

    socketMock = {
      id: "1",
      client: { conn: { id: 1, request: {} } } as any,
      conn: { id: 1, request: {} } as any,
      fns: [],
      flags: {},
      connected: true,
      disconnected: false,
      data: {},
      onAny: jest.fn(),
      on: jest.fn(),
      once: jest.fn(),
      off: jest.fn(),
      removeAllListeners: jest.fn(),
      emit: jest.fn(),
      listeners: jest.fn(),
      to: jest.fn(),
      in: jest.fn(),
      compress: jest.fn(),
    } as any;
  });

  it("client connection", () => {
    jest.spyOn(console, "log");
    jest.spyOn(console, "debug");
    gateway.handleConnection(socketMock);
    expect(console.log).toBeCalledWith("Client connected with id: ", "1");
    expect(console.debug).toBeCalled();
  });

  it("client disconnection", () => {
    jest.spyOn(console, "log");
    gateway.handleDisconnect(socketMock);
    expect(console.log).toBeCalledWith("Client disconnected with id: ", "1");
  });

  it("should handle get room by owner", () => {
    jest.spyOn(socketMock, "emit");
    gateway["_rooms"].set("room", {
      owner: "owner",
      pieces: [],
      status: "waiting",
    });
    gateway.handleGetRoomByOwner(socketMock, "room");
    expect(socketMock.emit).toBeCalledWith("owner", { owner: "owner" });
  });

  it("should handle join game", () => {
    gateway.handleJoinGame(socketMock, { room: "room", username: "username" });
    expect(gateway["_rooms"].get("room").owner).toEqual("username");
    expect(gateway["_clients"].get("1")).toBeDefined();
  });

  it("should handle start game", async () => {
    jest.spyOn(gateway, "emitPreviewBoard" as keyof SocketGateway);
    gateway.handleJoinGame(socketMock, {
      room: "room",
      username: "username",
    });
    gateway.handleStartGame(socketMock);
    expect(gateway.emitPreviewBoard).toBeCalled();
  });

  describe("rotate", () => {
    it("should rotate", () => {
      jest.spyOn(gateway, "emitPreviewBoard" as keyof SocketGateway);
      gateway.handleJoinGame(socketMock, {
        room: "room",
        username: "username",
      });
      gateway.handleStartGame(socketMock);
      gateway.handleRotate(socketMock);
      expect(gateway.emitPreviewBoard).toBeCalled();
    });
    it("should throw error if no player", () => {
      try {
        gateway.handleRotate(socketMock);
      } catch (error) {
        expect(error).toEqual(new Error("Player not found"));
      }
    });
    it("should throw error if no room", () => {
      gateway.handleJoinGame(socketMock, {
        room: "room",
        username: "username",
      });
      try {
        gateway.handleRotate(socketMock);
      } catch (error) {
        expect(error).toEqual(new Error("Player not in game"));
      }
    });
  });

  describe("Move Down", () => {
    it("should move", () => {
      jest.spyOn(gateway, "emitPreviewBoard" as keyof SocketGateway);
      gateway.handleJoinGame(socketMock, {
        room: "room",
        username: "username",
      });
      gateway.handleStartGame(socketMock);
      gateway.handleMoveDown(socketMock);
      expect(gateway.emitPreviewBoard).toBeCalled();
    });
    it("should throw error if no player", () => {
      try {
        gateway.handleMoveDown(socketMock);
      } catch (error) {
        expect(error).toEqual(new Error("Player not found"));
      }
    });
    it("should throw error if no room", () => {
      gateway.handleJoinGame(socketMock, {
        room: "room",
        username: "username",
      });
      try {
        gateway.handleMoveDown(socketMock);
      } catch (error) {
        expect(error).toEqual(new Error("Player not in game"));
      }
    });
  });

  describe("Move Left", () => {
    it("should move", () => {
      jest.spyOn(gateway, "emitPreviewBoard" as keyof SocketGateway);
      gateway.handleJoinGame(socketMock, {
        room: "room",
        username: "username",
      });
      gateway.handleStartGame(socketMock);
      gateway.handleMoveLeft(socketMock);
      expect(gateway.emitPreviewBoard).toBeCalled();
    });
    it("should throw error if no player", () => {
      try {
        gateway.handleMoveLeft(socketMock);
      } catch (error) {
        expect(error).toEqual(new Error("Player not found"));
      }
    });
    it("should throw error if no room", () => {
      gateway.handleJoinGame(socketMock, {
        room: "room",
        username: "username",
      });
      try {
        gateway.handleMoveLeft(socketMock);
      } catch (error) {
        expect(error).toEqual(new Error("Player not in game"));
      }
    });
  });

  describe("Move Right", () => {
    it("should move", () => {
      jest.spyOn(gateway, "emitPreviewBoard" as keyof SocketGateway);
      gateway.handleJoinGame(socketMock, {
        room: "room",
        username: "username",
      });
      gateway.handleStartGame(socketMock);
      gateway.handleMoveRight(socketMock);
      expect(gateway.emitPreviewBoard).toBeCalled();
    });
    it("should throw error if no player", () => {
      try {
        gateway.handleMoveRight(socketMock);
      } catch (error) {
        expect(error).toEqual(new Error("Player not found"));
      }
    });
    it("should throw error if no room", () => {
      gateway.handleJoinGame(socketMock, {
        room: "room",
        username: "username",
      });
      try {
        gateway.handleMoveRight(socketMock);
      } catch (error) {
        expect(error).toEqual(new Error("Player not in game"));
      }
    });
  });

  describe("drop", () => {
    it("should drop", () => {
      jest.spyOn(gateway, "emitPreviewBoard" as keyof SocketGateway);
      gateway.handleJoinGame(socketMock, {
        room: "room",
        username: "username",
      });
      gateway.handleStartGame(socketMock);
      gateway.handleDrop(socketMock);
      expect(gateway.emitPreviewBoard).toBeCalled();
    });
    it("should throw error if no player", () => {
      try {
        gateway.handleDrop(socketMock);
      } catch (error) {
        expect(error).toEqual(new Error("Player not found"));
      }
    });
    it("should throw error if no room", () => {
      gateway.handleJoinGame(socketMock, {
        room: "room",
        username: "username",
      });
      try {
        gateway.handleDrop(socketMock);
      } catch (error) {
        expect(error).toEqual(new Error("Player not in game"));
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
