import { useEffect, useState } from "react";
import Tetris from "../../components/tetris.tsx";
import NextPiece from "../../components/nextPiece/nextPiece.tsx";
import Spectras from "../../components/spectras/Spectras.tsx";
import useHashRouter from "../../hooks/useHashRouter.tsx";
import { useDispatch } from "react-redux";
import { SocketActionTypes } from "../../middlewares/socket.tsx";
import { store } from "../../stores";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./home.scss";

function Home() {
  const [hash] = useHashRouter();
  const dispatch = useDispatch();
  const [room, setRoom] = useState("");
  const [owner, setOwner] = useState("");
  const [username, setUsername] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [startLabel, setStartLabel] = useState("Start");
  const [error, setError] = useState("");
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
    const regex = /#(\w+)\[(\w+)]/;
    const matches = hash.match(regex);

    if (matches) {
      setRoom(matches[1]);
      setUsername(matches[2]);

      dispatch({ type: SocketActionTypes.CONNECT });
    } else {
      setError("Invalid URL");
    }
  }, [hash]);

  useEffect(() => {
    if (error) {
      notify(error);
      setError("");
    }
  }, [error]);

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
        <p>Loading...</p>
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
      setIsPlaying(data.status === "playing");
    },
  });

  dispatch({
    type: SocketActionTypes.ON, event: "gameFinished", callback: () => {
      setIsPlaying(false);
      setError("");
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

  return (
    <>
      <ToastContainer />
      <div className={"main-window"}>
        {
          !isPlaying && owner === username ? <button className={"btn-start"} onClick={() => {
            dispatch({ type: SocketActionTypes.EMIT, event: "startGame", data: {} });
          }}>{startLabel}</button> : <div></div>
        }
        <Tetris me={username} owner={owner} isPlaying={isPlaying} />
        <div className={"right-panel"}>
          <NextPiece />
          <Spectras name={username} />
        </div>
      </div>
    </>
  );
}

export default Home;
