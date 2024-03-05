import { io, Socket } from "socket.io-client";
import { SocketActionTypes, socketMiddleware } from "./socket";
import { BACK_URL } from "../utils/ip.ts";
import { store } from "../stores";

// Mock socket.io-client
jest.mock("socket.io-client");

describe("socketMiddleware", () => {
  let next: any;
  // @ts-ignore
  let dispatch: jest.Mock;

  beforeEach(() => {
    next = jest.fn();
    dispatch = jest.fn();
  });

  it("should handle SocketActionTypes.CONNECT", () => {
    const action = { type: SocketActionTypes.CONNECT };

    socketMiddleware(store)(next)(action);

    // Verify that io was called with the correct parameters
    expect(io).toHaveBeenCalledWith(`ws://${BACK_URL}:3001`, { transports: ['websocket'] });
  });

  it("should handle SocketActionTypes.DISCONNECT", () => {
    const socketMock: Partial<Socket> = {
      disconnect: jest.fn(),
    };
    store.getState = jest.fn(() => ({ rootReducer: { socket: socketMock } }));
    const action = { type: SocketActionTypes.DISCONNECT };

    socketMiddleware(store)(next)(action);

    // Verify that socket.disconnect was called
    expect(socketMock.disconnect).toHaveBeenCalled();
  });

  it("should handle SocketActionTypes.EMIT", () => {
    const socketMock: Partial<Socket> = {
      emit: jest.fn(),
    };
    store.getState = jest.fn(() => ({ rootReducer: { socket: socketMock } }));
    const action = { type: SocketActionTypes.EMIT, event: "someEvent", data: { key: "value" } };

    socketMiddleware(store)(next)(action);

    // Verify that socket.emit was called with the correct parameters
    expect(socketMock.emit).toHaveBeenCalledWith("someEvent", { key: "value" });
  });

  it("should handle SocketActionTypes.ON", () => {
    const socketMock: Partial<Socket> = {
      on: jest.fn(),
    };
    store.getState = jest.fn(() => ({ rootReducer: { socket: socketMock } }));
    const action = { type: SocketActionTypes.ON, event: "someEvent", callback: jest.fn() };

    socketMiddleware(store)(next)(action);

    // Verify that socket.on was called with the correct parameters
    expect(socketMock.on).toHaveBeenCalledWith("someEvent", action.callback);
  });

  it("should handle unknown action types", () => {
    const action = { type: "UNKNOWN_ACTION" };

    socketMiddleware(store)(next)(action);

    // Verify that next was called with the action
    expect(next).toHaveBeenCalledWith(action);
  });
});
