import "./tetris.scss";
import chroma from "chroma-js";
import { FC } from "react";

type TetrisProps = {
  grid: string[][];
  isOwner: boolean;
};


const Tetris: FC<TetrisProps> = ({ grid, isOwner }: TetrisProps) => {

  const darkenColor = (color: string) => {
    return chroma("#" + color).darken(0.4).hex();
  };

  if (grid.length === 0) {
    if (isOwner) {
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
        {grid.map((row, index) => (
          <div className={"row"} key={"row-" + index}>
            {row.map((cell, idx) => (
              <div key={"cell" + idx} className={cell === "00000000" ? "cell empty" : "cell full"} style={cell !== "00000000" ? {
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