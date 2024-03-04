import "./tetris.scss";
import { useEffect, useState } from "react";
import chroma from "chroma-js";
import { useDispatch } from "react-redux";
import { SocketActionTypes } from "../middlewares/socket.tsx";

function Tetris({ me, owner, isPlaying }: { me: string, owner: string, isPlaying: boolean }) {
  //const grid = Array.from(Array(20), () => new Array(10).fill(Math.floor(Math.random() * 2)));
  const dispatch = useDispatch();
  const [grid, setGrid] = useState<string[][]>([]);

  useEffect(() => {
    console.log("Tetris component mounted");
    dispatch({
      type: SocketActionTypes.ON, event: "previewBoard", callback: (data: { board: string[][] }) => {
        setGrid(data.board);
      },
    });

    dispatch({
      type: SocketActionTypes.ON, event: "gameOver", callback: () => {
        alert("Game Over");
      },
    });

    dispatch({
      type: SocketActionTypes.ON, event: "winner", callback: () => {
        alert("You won !");
      },
    });
  }, [dispatch]);

  const darkenColor = (color: string) => {
    return chroma("#" + color).darken(0.4).hex();
  };

  const handleKeyDown = (e: DocumentEventMap["keydown"]) => {
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
  };

  useEffect(() => {
    if (isPlaying) {
      document.addEventListener("keydown", handleKeyDown, true);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };

  }, [isPlaying]);

  if (grid.length === 0) {
    if (me === owner) {
      return (
        <>
          <p>Press Start to launch the game !</p>
        </>
      );
    }
    return (
      <>
        <p>Waiting for the owner to start the game...</p>
      </>
    );
  }

  return (
    <>
      <div className={"board"}>
        {grid.map((row) => (
          <div className={"row"}>
            {row.map((cell) => (
              <div className={cell === "00000000" ? "cell empty" : "cell full"} style={cell !== "00000000" ? {
                backgroundColor: `${darkenColor(cell)}`,
                borderColor: `#${cell}`,
              } : {}} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default Tetris;