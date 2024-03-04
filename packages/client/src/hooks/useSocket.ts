import { useRef } from "react";
import { io, Socket } from "socket.io-client";

export type UseSocketType = {
  socket: () => Socket | undefined;
  setSocket: (socket: Socket) => void;
  emit: (event: string, data: unknown) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (event: string, callback: (data: any) => void) => void;
  connect: () => void;
  disconnect: () => void;

}

const useSocket = (): UseSocketType => {
  const socketRef = useRef<Socket>();

  const socket = () => socketRef.current;
  const setSocket = (socket: Socket) => {
    socketRef.current = socket;
  }

  const connect = () => {
    if (socketRef.current) {
      setSocket(io(`ws://${import.meta.env.VITE_BACK_BASE_URL}:3001`, { transports: ['websocket'] }));
    }
  }

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }

  const emit = (event: string, data: unknown) => {
    if (socketRef.current) {
      socketRef.current?.emit(event, data);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const on = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current?.on(event, callback);
    }
  }

  return { socket, setSocket, emit, on, connect, disconnect};
}

export default useSocket;