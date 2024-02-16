import "./mainWindow.scss";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import Tetris from "../components/tetris.tsx";
import NextPiece from "../components/nextPiece/nextPiece.tsx";
import Spectras from "../components/spectras/Spectras.tsx";
import useHashRouter from "../hooks/useHashRouter.tsx";

function Home() {
  const [ hash,] = useHashRouter();
  const socketRef = useRef<Socket>();
  const [isError, setIsError] = useState(false);
  const [room, setRoom] = useState("");
  const [owner, setOwner] = useState("");
  const [username, setUsername] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [startLabel, setStartLabel] = useState("Start");
  const [error, setError] = useState("");

  useEffect(() => {
    const regex = /#(\w+)\[(\w+)]/;
    const matches = hash.match(regex);

    if (matches) {
      setRoom(matches[1]);
      setUsername(matches[2])

      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      socketRef.current = io(`ws://${import.meta.env.VITE_BACK_BASE_URL}:3001`, { transports: ['websocket'] });
    }
    else {
      console.log("Invalid URL");
      setIsError(true);
    }
  }, [hash]);

  if (isError) {
    return (
      <>
        <p>Invalid URL</p>
      </>
    )
  }

  if (!socketRef.current) {
    return (
      <>
        <p>Loading...</p>
      </>
    )
  }

  setInterval(() => {
    if (socketRef.current) {
      socketRef.current.emit("getGameStatus");
    }
  }, 1000);

  socketRef.current.on("joined", (data) => {
    setOwner(data.room.owner);
  });

  socketRef.current.on("connect", () => {
    console.log("Connected to server");
    if (socketRef.current && room && username) {
      socketRef.current.emit("join", { room, username });
    }
  });

  socketRef.current.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socketRef.current.on("gameStatus", (data: any) => {
    setIsPlaying(data.status === "playing");
  });

  socketRef.current.on("gameFinished", () => {
    setIsPlaying(false);
    setError(""); // TODO : check if it's the right place to reset the error
    setStartLabel("Restart");
  });

  socketRef.current.on("newOwner", (data) => {
    console.log(data);
    setOwner(data.owner);
  });

  socketRef.current.on("error", (error: any) => {
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
          socketRef.current!.emit("startGame");
        }}>{startLabel}</button> : <div></div>
      }
      <Tetris socket={socketRef.current} me={username} owner={owner} isPlaying={isPlaying}/>
      <div className={"right-panel"}>
        <NextPiece socket={socketRef.current}/>
        <Spectras socket={socketRef.current} name={username} />
      </div>
    </div>
  )
}

export default Home;
