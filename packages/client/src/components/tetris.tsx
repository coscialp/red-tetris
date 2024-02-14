import './tetris.scss';
import {useEffect, useState} from "react";


function Tetris({socket}: {socket:any}) {
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

  useEffect(() => {
    const handleKeyDown = (e) => {
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
    setGrid([
      [
        0n,        0n,
        0n,        0n,
        16777215n, 16777215n,
        16777215n, 16777215n,
        0n,        0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        0n, 0n, 0n, 0n, 0n,
        0n, 0n, 0n, 0n, 0n
      ],
      [
        16777215n, 16777215n,
        16777215n, 16777215n,
        16777015n, 16777015n,
        16777015n, 16777015n,
        0n,        0n
      ]
    ])
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
              <div className={cell === 0n ? "cell empty" : "cell full"} style={cell !== 0n ? {
                backgroundColor: `#${converter(cell - BigInt(50))}`,
                borderColor: `#${converter(cell)}`
              } : {}}/>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default Tetris;