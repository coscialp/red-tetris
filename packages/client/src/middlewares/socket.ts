import { Socket } from "socket.io-client";

export const socketMiddleware = (socket: Socket) => (params) => (next) => (action) => {
  const { dispatch, getState } = params
  const { type } = action

  switch (type) {
    case "socket/connect":
  }
};