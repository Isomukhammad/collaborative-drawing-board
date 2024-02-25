import Konva from "konva";
import { Link, useNavigate } from "react-router-dom";

import { Dispatch, JSX, SetStateAction, forwardRef } from "react";

import { instruments } from "../constant.ts";
import Icon from "./Icon.tsx";

interface InstrumentsProps {
  instrument: (typeof instruments)[number];
  setInstrument: Dispatch<SetStateAction<(typeof instruments)[number]>>;
  fillColor: string;
  setFillColor: Dispatch<SetStateAction<string>>;
  strokeColor: string;
  setStrokeColor: Dispatch<SetStateAction<string>>;
}

const Instruments = forwardRef<Konva.Transformer, InstrumentsProps>(
  (
    {
      instrument,
      setInstrument,
      fillColor,
      setFillColor,
      strokeColor,
      setStrokeColor,
    },
    ref,
  ): JSX.Element => {
    return (
      <div className={"flex justify-between p-4 font-medium"}>
        <div className={"flex w-fit gap-3"}>
          <Link to={"/"} className={"custom-button"}>
            Go back
          </Link>
          {instruments.map((item) => {
            return (
              <button
                key={item.id}
                type={"button"}
                onClick={() => {
                  if (ref.current) {
                    ref.current.nodes([]);
                  }
                  setInstrument(item);
                }}
                className={`flex items-center gap-2 rounded-md p-2 hover:bg-neutral-200
              active:bg-neutral-300 ${
                item === instrument ? "bg-neutral-100" : ""
              }`}
              >
                <Icon name={item.icon} className={"h-6 w-6 stroke-black"} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
        <div className={"flex items-center gap-2"}>
          <div className={"flex items-center gap-2 p-2"}>
            <input
              type={"color"}
              id={"color"}
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className={"w-6 rounded-md"}
            />
            <label htmlFor={"color"}>Fill</label>
          </div>
          <div className={"flex items-center gap-2 p-2"}>
            <input
              type={"color"}
              id={"color"}
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className={"w-6 rounded-md"}
            />
            <label htmlFor={"color"}>Stroke</label>
          </div>
        </div>
      </div>
    );
  },
);

export default Instruments;
