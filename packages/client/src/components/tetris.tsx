import './tetris.scss';
import {useState} from "react";


function Tetris({socket}: {socket:any}) {
  //const grid = Array.from(Array(20), () => new Array(10).fill(Math.floor(Math.random() * 2)));
  const [grid, setGrid] = useState<bigint[][]>([]);

  socket.on('previewBoard', (data: any) => {
    setGrid(data);
  });

  const converter = (color: bigint) => {
    let colorString = color.toString(16);
    while (colorString.length < 8) {
      colorString = '0' + colorString;
    }
    return colorString;
  }
  console.log(converter(16776986n));
  return (
    <>
    <button onClick={socket.emit("startGame")}>Start</button>
    <div className={"board"}>
      {grid.map((row) => (
        <div className={"row"}>
          {row.map((cell) => (
            <div className={cell === 0n ? "cell empty" : "cell full"} style={cell !== 0n ? {backgroundColor: `#${converter(cell)}`, borderColor: `#${converter(cell)}`} : {}}/>
          ))}
        </div>
      ))}
    </div>
    </>
  );
}

export default Tetris;