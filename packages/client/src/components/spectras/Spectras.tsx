import {useState} from "react";
import "./spectras.scss";

function Spectras({socket}: {socket:any}) {

  const [spectras, setSpectras] = useState<{name: string, map: string[][]}[]>();

  socket.on('spectraBoard', (data: any) => {
    setSpectras(data);
  });

  console.log(spectras);

  return(
    <>
      <div className={"spectras"}>
        {spectras?.map((spectra) => (
          <div className={"spectra"}>
            {spectra.map.map((row) => (
              <div className={"row"} style={{gridTemplateColumns: `repeat(${row.length}, 1fr)`,
                height: `calc(100px / ${row.length})`}}>
                {row.map((cell) => (
                  <div className={cell === "00000000" ? "cell empty" : "cell full"} style={cell !== "00000000" ? {backgroundColor: `#${cell}`, borderColor: `#${cell}`} : {}}/>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default Spectras;