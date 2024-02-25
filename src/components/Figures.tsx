import Konva from "konva";
import { Circle, Line, Rect } from "react-konva";

import { JSX } from "react";

import { IInstrument } from "../constant.ts";
import { ICircle, ILine, IRectangle } from "../types.ts";

interface FiguresProps {
  instrument: IInstrument;
  handleClick: (event: Konva.KonvaEventObject<MouseEvent>) => void;
  shapes: IRectangle[] | ICircle[] | ILine[] | [];
}

const Figures = ({
  instrument,
  handleClick,
  shapes,
}: FiguresProps): JSX.Element => {
  return (
    <>
      {shapes.map((shape: IRectangle | ICircle | ILine) => {
        if ("height" in shape && "width" in shape) {
          return (
            <Rect
              key={shape.id}
              x={shape.x}
              y={shape.y}
              stroke={shape.stroke}
              strokeWidth={2}
              fill={shape.color}
              height={shape.height}
              width={shape.width}
              draggable={instrument.name === "select"}
              onClick={handleClick}
            />
          );
        } else if ("radius" in shape) {
          return (
            <Circle
              key={shape.id}
              x={shape.x}
              y={shape.y}
              radius={shape.radius}
              stroke={shape.stroke}
              strokeWidth={2}
              fill={shape.color}
              draggable={instrument.name === "select"}
              onClick={handleClick}
            />
          );
        } else if ("points" in shape) {
          return (
            <Line
              key={shape.id}
              lineCap={"round"}
              lineJoin={"round"}
              points={shape.points}
              stroke={shape.stroke}
              strokeWidth={2}
              fill={shape.fill}
              draggable={instrument.name === "select"}
              onClick={handleClick}
            />
          );
        } else {
          return null;
        }
      })}
    </>
  );
};

export default Figures;
