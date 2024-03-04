import { useState } from "react";
import "./spectras.scss";
import { useDispatch } from "react-redux";

function Spectras({ name }: { name: string }) {
  const dispatch = useDispatch();
  const [spectras, setSpectras] = useState<{ name: string, map: string[][] }[]>();

  dispatch({
    type: "ON", event: "spectraBoard", callback: (data: { name: string, map: string[][] }[]) => {
      setSpectras(data);
    },
  });

  if (!spectras || spectras.length === 1) {
    return (
      <>
      </>
    );
  }

  return (
    <>
      <div className={"spectras"}>
        {spectras?.map((spectra) => {
          if (spectra.name !== name) {
            return (
              <div className={"spectra"}>
                {spectra.map.map((row) => (
                  <div className={"row"} style={{
                    gridTemplateColumns: `repeat(${row.length}, 1fr)`,
                    height: `calc(100px / ${row.length})`,
                  }}>
                    {row.map((cell) => (
                      <div className={cell === "00000000" ? "cell empty" : "cell full"}
                           style={cell !== "00000000" ? {
                             backgroundColor: `#${cell}`,
                             borderColor: `#${cell}`,
                           } : {}} />
                    ))}
                  </div>
                ))}
                <div className={"spectra-username"}>{spectra.name}</div>
              </div>
            );
          }
        })}
      </div>
    </>
  );
}

export default Spectras;