import { useCallback, useEffect, useState } from "react";
import Tetris from "../../components/tetris.tsx";
import NextPiece from "../../components/nextPiece/nextPiece.tsx";
import Spectras from "../../components/spectras/Spectras.tsx";
import useHashRouter from "../../hooks/useHashRouter.tsx";
import { useDispatch } from "react-redux";
import { SocketActionTypes } from "../../middlewares/socket.tsx";
import { toast, ToastContainer } from "react-toastify";

import "./home.scss";
import { store } from "../../stores";

function Home() {
  const [hash] = useHashRouter();
  const dispatch = useDispatch();
  const [room, setRoom] = useState("");
  const [owner, setOwner] = useState("");
  const [username, setUsername] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [startLabel, setStartLabel] = useState("Start");
  const [error, setError] = useState("");
  const [grid, setGrid] = useState<string[][]>([]);
  const [isWinner, setIsWinner] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [nextPiece, setNextPiece] = useState<string[][]>([]);
  const [spectras, setSpectras] = useState<{ name: string, map: string[][] }[]>([]);

  const resetGame = () => {
    setError("");
    setGrid([]);
    setNextPiece([]);
    setSpectras([]);
  }

  const notify = (errorMsg: string) => toast.error(errorMsg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });


  useEffect(() => {
    resetGame();
    const regex = /#(\w+)\[(\w+)]/;
    const matches = hash.match(regex);

    if (matches) {
      setRoom(matches[1]);
      setUsername(matches[2]);

      if (store.getState().rootReducer.socket !== null) {
        dispatch({ type: SocketActionTypes.DISCONNECT });
      }
      dispatch({ type: SocketActionTypes.CONNECT });
    } else {
      setError("Invalid URL");
    }
  }, [hash, dispatch]);

  useEffect(() => {
    if (error) {
      notify(error);
      setError("");
    }
  }, [error]);

  const handleKeyDown = useCallback((e: DocumentEventMap["keydown"]) => {
    const key = e.key;
    switch (key) {
      case "ArrowUp":
        dispatch({ type: SocketActionTypes.EMIT, event: "rotate", data: {} });
        break;
      case "ArrowDown":
        dispatch({ type: SocketActionTypes.EMIT, event: "moveDown", data: {} });
        break;
      case "ArrowLeft":
        dispatch({ type: SocketActionTypes.EMIT, event: "moveLeft", data: {} });
        break;
      case "ArrowRight":
        dispatch({ type: SocketActionTypes.EMIT, event: "moveRight", data: {} });
        break;
      case " ":
        dispatch({ type: SocketActionTypes.EMIT, event: "drop", data: {} });
        break;
    }
  }, [dispatch]);

  useEffect(() => {
    if (isWinner || isGameOver) {
      document.removeEventListener("keydown", handleKeyDown, true);
    }
  }, [isWinner, isGameOver, handleKeyDown]);

  useEffect(() => {
    if (isPlaying) {
      setIsWinner(false);
      setIsGameOver(false);
      document.addEventListener("keydown", handleKeyDown, true);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };

  }, [isPlaying, handleKeyDown]);

  if (store.getState().rootReducer.socket === null) {
    return (
      <div style={
        {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }
      }>
        <ToastContainer />
        <div>Connecting...</div>
      </div>
    );
  }

  setInterval(() => {
    dispatch({ type: SocketActionTypes.EMIT, event: "getGameStatus", data: {} });
  }, 1000);


  dispatch({
    type: SocketActionTypes.ON, event: "joined", callback: (data: { room: { owner: string } }) => {
      setOwner(data.room.owner);
    },
  });

  dispatch({
    type: SocketActionTypes.ON, event: "connect", callback: () => {
      console.log("Connected to server");
      if (room && username) {
        console.log("Joining room #" + room + " with username " + username);
        dispatch({ type: SocketActionTypes.EMIT, event: "join", data: { room, username } });
      }
    },
  });

  dispatch({
    type: SocketActionTypes.ON, event: "disconnect", callback: () => {
      console.log("Disconnected from server");
    },
  });

  dispatch({
    type: SocketActionTypes.ON, event: "gameStatus", callback: (data: { status: string }) => {
      if (data.status === "playing" && !isPlaying) {
        toast.dismiss();
      }
      setIsPlaying(data.status === "playing");
    },
  });

  dispatch({
    type: SocketActionTypes.ON, event: "gameFinished", callback: () => {
      setIsPlaying(false);
      resetGame();
      setStartLabel("Restart");
    },
  });

  dispatch({
    type: SocketActionTypes.ON, event: "newOwner", callback: (data: { owner: string }) => {
      setOwner(data.owner);
    },
  });

  dispatch({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: SocketActionTypes.ON, event: "error", callback: (error: any) => {
      setError(error.error.details.message);
    },
  });

  dispatch({
    type: SocketActionTypes.ON, event: "previewBoard", callback: (data: { board: string[][] }) => {
      setGrid(data.board);
    },
  });

  dispatch({
    type: SocketActionTypes.ON, event: "gameOver", callback: () => {
      setIsGameOver(true);
    },
  });

  dispatch({
    type: SocketActionTypes.ON, event: "winner", callback: () => {
      setIsWinner(true);
      resetGame();
    },
  });

  dispatch({
    type: SocketActionTypes.ON, event: "nextPiece", callback: (data: { nextPiece: string[][] }) => {
      setNextPiece(data.nextPiece);
    },
  });

  dispatch({
    type: SocketActionTypes.ON, event: "spectraBoard", callback: (data: { name: string, map: string[][] }[]) => {
      setSpectras(data);
    },
  });

  const handleStartGame = () => {
    dispatch({ type: SocketActionTypes.EMIT, event: "startGame", data: {} });
  };

  return (
    <>
      <ToastContainer />
      <div className={"main-window"}>
        {
          !isPlaying && owner === username ?
            <button className={"btn-start"} onClick={handleStartGame}>{startLabel}</button> : <div></div>
        }
        {isWinner ? <h1 style={{
          color: "green",
          fontSize: "3em",
        }}>You win !</h1> : null}
        {isGameOver ? <h1 style={{
          color: "red",
          fontSize: "3em",
        }}>Game Over</h1> : null}
        <Tetris isOwner={username === owner} grid={grid} />
        <div className={"right-panel"}>
          <NextPiece nextPiece={nextPiece} />
          <Spectras name={username} spectras={spectras} />
        </div>
      </div>
    </>
  );
}

export default Home;
