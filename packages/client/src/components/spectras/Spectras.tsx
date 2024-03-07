import "./spectras.scss";
import { FC } from "react";

type SpectrasProps = {
  name: string;
  spectras: { name: string, map: string[][] }[];
};

const Spectras: FC<SpectrasProps> = ({ name, spectras }: SpectrasProps) => {

  if (spectras.length <= 1) {
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
              <div className={"spectra"} key={"spectra-" + spectra.name}>
                {spectra.map.map((row, index) => (
                  <div className={"row"} key={"row-spectra-" + index} style={{
                    gridTemplateColumns: `repeat(${row.length}, 1fr)`,
                    height: `calc(100px / ${row.length})`,
                  }}>
                    {row.map((cell, idx) => (
                      <div key={'cell-spectra-' + idx} className={cell === "00000000" ? "cell empty" : "cell full"}
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
};

export default Spectras;