import {useState} from "react";
import "./nextPiece.scss";

function NextPiece({socket}: {socket:any}) {

  const [nextPiece, setNextPiece] = useState<string[][]>([]);

  socket.on('nextPiece', (data: any) => {
    console.log(data.nextPiece);
    setNextPiece(data.nextPiece);

  });

  if (nextPiece.length === 0) {
    return (
      <>
        <p>Loading...</p>
      </>
    )
  }

  return (
    <>
      <div className={"next-piece"}>
        {nextPiece.map((row) => (
          <div className={"row"} style={{gridTemplateColumns: `repeat(${row.length}, 1fr)`,
            height: `calc(100px / ${row.length})`}}>
            {row.map((cell) => (
              <div className={cell === "00000000" ? "cell empty" : "cell full"} style={cell !== "00000000" ? {backgroundColor: `#${cell}`, borderColor: `#${cell}`} : {}}/>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default NextPiece;