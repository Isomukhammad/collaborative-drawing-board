import Konva from "konva";
import { Circle, Line, Rect } from "react-konva";

import { JSX } from "react";

import { IInstrument } from "../constant.ts";
import { ICircle, ILine, IRectangle } from "../reducer.ts";

interface FiguresProps {
  instrument: IInstrument;
  handleClick: (event: Konva.KonvaEventObject<MouseEvent>) => void;
  rectangles: IRectangle[] | [];
  circles: ICircle[] | [];
  lines: ILine[] | [];
}

const Figures = ({
  instrument,
  handleClick,
  rectangles,
  circles,
  lines,
}: FiguresProps): JSX.Element => {
  return (
    <>
      {rectangles.map((rectangle) => {
        return (
          <Rect
            key={rectangle.id}
            x={rectangle.x}
            y={rectangle.y}
            stroke={rectangle.stroke}
            strokeWidth={2}
            fill={rectangle.color}
            height={rectangle.height}
            width={rectangle.width}
            draggable={instrument.name === "select"}
            onClick={handleClick}
          />
        );
      })}
      {circles.map((circle) => {
        return (
          <Circle
            key={circle.id}
            x={circle.x}
            y={circle.y}
            radius={circle.radius}
            stroke={circle.stroke}
            strokeWidth={2}
            fill={circle.color}
            draggable={instrument.name === "select"}
            onClick={handleClick}
          />
        );
      })}
      {lines.map((line) => {
        return (
          <Line
            key={line.id}
            lineCap={"round"}
            lineJoin={"round"}
            points={line.points}
            stroke={line.stroke}
            strokeWidth={2}
            fill={line.fill}
            draggable={instrument.name === "select"}
            onClick={handleClick}
          />
        );
      })}
    </>
  );
};

export default Figures;
