import "./mainWindow.scss";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import Tetris from "../components/tetris.tsx";
import NextPiece from "../components/nextPiece/nextPiece.tsx";
import Spectras from "../components/spectras/Spectras.tsx";

const poller = async (socket: Socket)  => {
  // eslint-disable-next-line no-constant-condition
  while (1) {
    socket.emit("getGameStatus");
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isError, setIsError] = useState(false);
  const [room, setRoom] = useState("");
  const [owner, setOwner] = useState("");
  const [username, setUsername] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [startLabel, setStartLabel] = useState("Start");
  const [error, setError] = useState("");

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

  poller(socket);

  socket.on("joined", (data) => {
    setOwner(data.room.owner);
  });

  socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("join", { room, username });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("gameStatus", (data: any) => {
    setIsPlaying(data.status === "playing");
  });

  socket.on("gameFinished", () => {
    setIsPlaying(false);
    setError(""); // TODO : check if it's the right place to reset the error
    setStartLabel("Restart");
  });

  socket.on("newOwner", (data) => {
    console.log(data);
    setOwner(data.owner);
  });

  socket.on("error", (error: any) => {
    console.log("Error: ", error);
    setError(error.error.details.message);
  });

  if (error !== "") {
    return (
      <>
        <div>{error}</div>
      </>
    )
  }

  return (
    <div className={"main-window"}>
      {
        !isPlaying && owner === username ? <button className={"btn-start"} onClick={() => {
          socket!.emit("startGame");
        }}>{startLabel}</button> : <div></div>
      }
      <Tetris socket={socket} me={username} owner={owner}/>
      <div className={"right-panel"}>
        <NextPiece socket={socket}/>
        <Spectras socket={socket} name={username} />
      </div>
    </div>
  )
}

export default Home;
