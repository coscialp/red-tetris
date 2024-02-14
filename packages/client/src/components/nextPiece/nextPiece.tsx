import {useState} from "react";
import "./nextPiece.scss";

function NextPiece({socket}: {socket:any}) {

  const [nextPiece, setNextPiece] = useState<string[][]>([]);

  socket.on('nextPiece', (data: any) => {
    setNextPiece(data.nextPiece);
  });

  if (nextPiece.length === 0) {
    setNextPiece([
      ["FFFFFFC8", "00000000"],
      ["00000000", "FFFFFFFF"],
    ]);
  }

  return (
    <>
      <div className={"next-piece"}>
        {nextPiece.map((row) => (
          <div className={"row"} style={{gridTemplateColumns: `repeat(${row.length}, 1fr)`}}>
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