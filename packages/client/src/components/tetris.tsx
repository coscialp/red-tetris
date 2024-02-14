import "./tetris.scss";
import {useEffect, useState} from "react";


function Tetris({socket}: {socket:any}) {
  //const grid = Array.from(Array(20), () => new Array(10).fill(Math.floor(Math.random() * 2)));
  const [grid, setGrid] = useState<string[][]>([]);

  socket.on('previewBoard', (data: any) => {
    setGrid(data.board);
  });

  socket.on("gameOver", () => {
    alert("Game Over");
  });


  useEffect(() => {
    const handleKeyDown = (e: DocumentEventMap["keydown"]) => {
      const key = e.key;

      switch (key) {
        case 'ArrowUp':
          console.log('rotate');
          socket.emit('rotate');
          break;

        case 'ArrowDown':
          console.log('moveDown');
          socket.emit('moveDown');
          break;

        case 'ArrowLeft':
          console.log('moveLeft');
          socket.emit('moveLeft');
          break;

        case 'ArrowRight':
          console.log('moveRight');
          socket.emit('moveRight');
          break;

        case ' ':
          console.log('drop');
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
            <div className={cell === "00000000" ? "cell empty" : "cell full"} style={cell !== "00000000" ? {backgroundColor: `#${cell}`, borderColor: `#${cell}`} : {}}/>
          ))}
        </div>
      ))}
    </div>
    </>
  );
}

export default Tetris;