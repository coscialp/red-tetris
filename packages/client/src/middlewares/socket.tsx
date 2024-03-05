import { io } from "socket.io-client";
import { BACK_URL } from "../utils/ip.ts";

export enum SocketActionTypes {
  CONNECT = "socket/connect",
  DISCONNECT = "socket/disconnect",
  EMIT = "socket/emit",
  ON = "socket/on",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const socketMiddleware = (store: any) => (next: any) => (action: any) => {
  const { type } = action;
  const { socket, setSocket } = store.getState().rootReducer;

  switch (type) {
    case SocketActionTypes.CONNECT:
      if (!socket) {
        setSocket(io(`ws://${BACK_URL}:3001`, { transports: ['websocket'] }));
      }
      break;
    case SocketActionTypes.DISCONNECT:
      if (socket) {
        socket.disconnect();
      }
      break;
    case SocketActionTypes.EMIT:
      if (socket) {
        socket.emit(action.event, action.data);
      }
      break;
    case SocketActionTypes.ON:
      if (socket) {
        socket.on(action.event, action.callback);
      }
      break;
    default:
      break;
  }

  return next(action);
};