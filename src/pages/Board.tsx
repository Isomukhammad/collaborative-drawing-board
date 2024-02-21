import Konva from "konva";

import { JSX, useRef, useState } from "react";

import Instruments from "../components/Instruments.tsx";
import Stage from "../components/Whiteboard.tsx";
import Whiteboard from "../components/Whiteboard.tsx";
import { instruments } from "../constant.ts";

const BoardPage = (): JSX.Element => {
  const [instrument, setInstrument] = useState<(typeof instruments)[number]>(
    instruments[0],
  );
  const [fillColor, setFillColor] = useState<string>("#000000");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");

  const transformRef = useRef<Konva.Transformer | null>(null);

  // const handleExport = (): void => {
  //   if (!stageRef.current) return;
  //   const dataUrl = stageRef.current.toDataURL();
  //   if (dataUrl) {
  //     const link = document.createElement("a");
  //     link.download = "image.png";
  //     link.href = dataUrl;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };

  return (
    <main className={"container mx-auto flex flex-col gap-4 px-5 py-6"}>
      <Instruments
        ref={transformRef}
        instrument={instrument}
        setInstrument={setInstrument}
        fillColor={fillColor}
        setFillColor={setFillColor}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
      />
      <div
        className={
          "aspect-video w-full cursor-pointer overflow-hidden border border-neutral-300 shadow-2xl"
        }
      >
        <Whiteboard
          ref={transformRef}
          instrument={instrument}
          fillColor={fillColor}
          strokeColor={strokeColor}
        />
      </div>
    </main>
  );
};

export default BoardPage;
