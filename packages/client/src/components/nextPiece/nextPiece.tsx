import { useState } from "react";
import "./nextPiece.scss";
import { useDispatch } from "react-redux";
import { SocketActionTypes } from "../../middlewares/socket.tsx";

function NextPiece() {
  const dispatch = useDispatch();
  const [nextPiece, setNextPiece] = useState<string[][]>();

  dispatch({
    type: SocketActionTypes.ON, event: "nextPiece", callback: (data: { nextPiece: string[][] }) => {
      setNextPiece(data.nextPiece);
    },
  });

  if (!nextPiece || nextPiece.length === 0) {
    return (
      <>
      </>
    );
  }

  return (
    <>
      <div className={"next-piece"}>
        {nextPiece.map((row) => (
          <div className={"row"} style={{
            gridTemplateColumns: `repeat(${row.length}, 1fr)`,
            height: `calc(100px / ${row.length})`,
          }}>
            {row.map((cell) => (
              <div className={cell === "00000000" ? "cell empty" : "cell full"}
                   style={cell !== "00000000" ? { backgroundColor: `#${cell}`, borderColor: `#${cell}` } : {}} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default NextPiece;