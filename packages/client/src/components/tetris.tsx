import "./tetris.scss";
import { useCallback, useEffect, useState } from "react";
import chroma from "chroma-js";
import { useDispatch } from "react-redux";
import { SocketActionTypes } from "../middlewares/socket.tsx";

function Tetris({ me, owner, isPlaying }: { me: string, owner: string, isPlaying: boolean }) {
  //const grid = Array.from(Array(20), () => new Array(10).fill(Math.floor(Math.random() * 2)));
  const dispatch = useDispatch();
  const [grid, setGrid] = useState<string[][]>([]);
  const [isWinner, setIsWinner] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    console.log("Tetris component mounted");
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
      },
    });
  }, [dispatch]);

  const darkenColor = (color: string) => {
    return chroma("#" + color).darken(0.4).hex();
  };

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
      {isWinner ? <h1 style={{
        color: "green",
        fontSize: "3em",
      }}>You win !</h1> : null}
      {isGameOver ? <h1 style={{
        color: "red",
        fontSize: "3em",
      }}>Game Over</h1> : null}
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