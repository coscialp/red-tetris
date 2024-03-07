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