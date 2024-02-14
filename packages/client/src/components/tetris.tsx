import "./tetris.scss";
import { useState } from "react";


function Tetris({socket}: {socket:any}) {
  //const grid = Array.from(Array(20), () => new Array(10).fill(Math.floor(Math.random() * 2)));
  const [grid, setGrid] = useState<string[][]>([]);

  socket.on('previewBoard', (data: any) => {
    setGrid(data.board);
  });

  socket.on("gameOver", () => {
    alert("Game Over");
  });

  return (
    <>
    <button onClick={() => socket.emit("startGame")}>Start</button>
    <div className={"board"}>
      {grid.map((row) => (
        <div className={"row"}>
          {row.map((cell) => (
            <div className={cell === "00000000" ? "cell empty" : "cell full"} style={cell !== "00000000" ? {backgroundColor: `#${cell}`, borderColor: `#${cell}`} : {}}/>
          ))}
        </div>
      ))}
    </div>
    </>
  );
}

export default Tetris;