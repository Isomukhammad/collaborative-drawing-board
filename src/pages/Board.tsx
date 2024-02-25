import { off, onChildRemoved, ref } from "firebase/database";
import Konva from "konva";
import { useNavigate, useParams } from "react-router-dom";

import { JSX, useEffect, useRef, useState } from "react";

import Instruments from "../components/Instruments.tsx";
import Whiteboard from "../components/Whiteboard.tsx";
import { instruments } from "../constant.ts";
import { realtimeDatabase } from "../firebase/firebase.ts";

const BoardPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [instrument, setInstrument] = useState<(typeof instruments)[number]>(
    instruments[0],
  );
  const [fillColor, setFillColor] = useState<string>("#000000");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  useEffect(() => {
    const boardsRef = ref(realtimeDatabase, "boards");

    onChildRemoved(boardsRef, (snapshot) => {
      if (snapshot.key === id) {
        navigate("/");
      }
    });

    return () => {
      off(boardsRef, "child_removed");
    };
  }, [id, navigate]);

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
      {isLoading && (
        <div className={"flex h-full items-center justify-center"}>
          <p className={"text-3xl text-neutral-300"}>Loading...</p>
        </div>
      )}
      <div
        className={`aspect-video w-full cursor-pointer overflow-hidden border border-neutral-300 shadow-2xl ${isLoading ? "invisible" : ""}`}
      >
        <Whiteboard
          instrument={instrument}
          fillColor={fillColor}
          strokeColor={strokeColor}
          setIsLoading={setIsLoading}
          ref={transformRef}
        />
      </div>
    </main>
  );
};

export default BoardPage;
