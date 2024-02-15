import "./tetris.scss";
import {useEffect, useState} from "react";
import chroma from "chroma-js";

function Tetris({socket}: {socket:any}) {
  //const grid = Array.from(Array(20), () => new Array(10).fill(Math.floor(Math.random() * 2)));
  const [grid, setGrid] = useState<string[][]>([]);



  useEffect(() => {
    socket.on('previewBoard', (data: any) => {
      setGrid(data.board);
    });

    socket.on("gameOver", () => {
      console.log("Receiving Game Over");
      alert("Game Over");
    });
  }, []);

  const darkenColor = (color: string) => {
    return chroma("#" + color).darken(0.3).hex();
  }

  useEffect(() => {
    const handleKeyDown = (e: DocumentEventMap["keydown"]) => {
      const key = e.key;

      switch (key) {
        case 'ArrowUp':
          socket.emit('rotate');
          break;
        case 'ArrowDown':
          socket.emit('moveDown');
          break;
        case 'ArrowLeft':
          socket.emit('moveLeft');
          break;
        case 'ArrowRight':
          socket.emit('moveRight');
          break;
        case ' ':
          socket.emit('drop');
          break;
      }

    };
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };

  }, []);

  if (grid.length === 0) {
    return (
      <>
        <p>Loading...</p>
      </>
    )
  }

  return (
    <>
    <div className={"board"}>
      {grid.map((row) => (
        <div className={"row"}>
          {row.map((cell) => (
            <div className={cell === "00000000" ? "cell empty" : "cell full"} style={cell !== "00000000" ? {backgroundColor: `${darkenColor(cell)}`, borderColor: `#${cell}`} : {}}/>
          ))}
        </div>
      ))}
    </div>
    </>
  );
}

export default Tetris;