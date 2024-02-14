import "./mainWindow.scss";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import Tetris from "../components/tetris.tsx";
import NextPiece from "../components/nextPiece/nextPiece.tsx";
import Spectras from "../components/spectras/Spectras.tsx";

function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isError, setIsError] = useState(false);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const url = window.location.href;
    const regex = /#(\w+)\[(\w+)]/;
    const matches = url.match(regex);

    if (matches) {
      setRoom(matches[1]);
      setUsername(matches[2])

      setSocket(io(`ws://${import.meta.env.VITE_BACK_BASE_URL}:3001`, { transports: ['websocket'] }));
    }
    else {
      console.log("Invalid URL");
      setIsError(true);
    }
  }, []);

  if (isError) {
    return (
      <>
        <p>Invalid URL</p>
      </>
    )
  }

  if (!socket) {
    return (
      <>
        <p>Loading...</p>
      </>
    )
  }

  socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("join", { room, username });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  return (
    <div className={"main-window"}>
      <button className={"btn-start"} onClick={() => {socket!.emit("startGame")}}>Start</button>
      <Tetris socket={socket}/>
      <div className={"right-panel"}>
        <NextPiece socket={socket} />
        <Spectras socket={socket} />
      </div>
    </div>
  )
}

export default Home;
