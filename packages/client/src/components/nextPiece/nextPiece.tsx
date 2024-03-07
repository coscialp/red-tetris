import "./nextPiece.scss";

function NextPiece({ nextPiece }: { nextPiece: string[][] }) {
  if (nextPiece.length === 0) {
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