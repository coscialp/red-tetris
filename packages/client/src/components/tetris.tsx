import './tetris.scss';


function Tetris() {
  //const grid = Array.from(Array(20), () => new Array(10).fill(Math.floor(Math.random() * 2)));
  const grid = [
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
  ];

  const converter = (color: bigint) => {
    let colorString = color.toString(16);
    while (colorString.length < 8) {
      colorString = '0' + colorString;
    }
    return colorString;
  }
  console.log(converter(16776986n));
  return (
    <div className={"board"}>
      {grid.map((row) => (
        <div className={"row"}>
          {row.map((cell) => (
            <div className={cell === 0n ? "cell empty" : "cell full"} style={cell !== 0n ? {backgroundColor: `#${converter(cell)}`, borderColor: `#${converter(cell)}`} : {}}/>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Tetris;