import Konva from "konva";
import { Layer, Rect, Stage, Transformer } from "react-konva";
import { v4 as uuidv4 } from "uuid";

import { JSX, forwardRef, useRef, useState } from "react";

import { instruments } from "../constant.ts";
import { ICircle, ILine, IRectangle } from "../reducer.ts";
import Figures from "./Figures.tsx";

interface WhiteboardProps {
  instrument: (typeof instruments)[number];
  fillColor: string;
  strokeColor: string;
}

const Whiteboard = forwardRef<Konva.Transformer, WhiteboardProps>(
  ({ instrument, fillColor, strokeColor }, ref): JSX.Element => {
    const [rectangles, setRectangles] = useState<IRectangle[] | []>([]);
    const [circles, setCircles] = useState<ICircle[] | []>([]);
    const [lines, setLines] = useState<ILine[] | []>([]);

    const stageRef = useRef<Konva.Stage | null>(null);
    const isDrawing = useRef<boolean>(false);
    const currentShapeId = useRef<string>("");

    const onPointerDown = () => {
      if (instrument.name === "select") return;
      const stage = stageRef.current;
      if (stage) {
        if (instrument.name !== "eraser") {
          const { x, y } = stage.getPointerPosition();
          const id = uuidv4();

          currentShapeId.current = id;
          isDrawing.current = true;

          switch (instrument.name) {
            case "square":
              setRectangles([
                ...rectangles,
                {
                  id,
                  x,
                  y,
                  width: 0,
                  height: 0,
                  color: fillColor,
                  stroke: strokeColor,
                },
              ]);
              break;
            case "circle":
              setCircles([
                ...circles,
                {
                  id,
                  x,
                  y,
                  radius: 0,
                  color: fillColor,
                  stroke: strokeColor,
                },
              ]);
              break;
            case "pencil":
              setLines((lines) => [
                ...lines,
                {
                  id,
                  points: [x, y],
                  stroke: fillColor,
                  fill: fillColor,
                },
              ]);
              break;
            default:
              return;
          }
        } else {
          const shape = stage.getIntersection(stage.getPointerPosition());
          if (shape) {
            if (shape.id() === "bg") {
              shape.destroy();
            } else {
              shape.remove();
            }
          }
        }
      }
    };

    const onPointerMove = () => {
      if (!isDrawing.current) return;

      const stage = stageRef.current;
      if (stage) {
        if (instrument.name !== "eraser") {
          const { x, y } = stage.getPointerPosition();

          switch (instrument.name) {
            case "square":
              setRectangles((rectangles) =>
                rectangles.map((rectangle) => {
                  if (rectangle.id === currentShapeId.current) {
                    const width = x - rectangle.x;
                    const height = y - rectangle.y;
                    return {
                      ...rectangle,
                      width,
                      height,
                    };
                  }
                  return rectangle;
                }),
              );
              break;
            case "circle":
              setCircles((circles) =>
                circles.map((circle) => {
                  if (circle.id === currentShapeId.current) {
                    return {
                      ...circle,
                      radius:
                        ((x - circle.x) ** 2 + (y - circle.y) ** 2) ** 0.5,
                    };
                  }
                  return circle;
                }),
              );
              break;
            case "pencil":
              setLines((lines) =>
                lines.map((line) => {
                  if (line.id === currentShapeId.current) {
                    return {
                      ...line,
                      points: [...line.points, x, y],
                    };
                  }
                  return line;
                }),
              );
              break;
            default:
              return;
          }
        }
      }
    };

    const onPointerUp = () => {
      isDrawing.current = false;
    };

    const handleClick = (event: Konva.KonvaEventObject<MouseEvent>): void => {
      if (instrument.name !== "select") return;
      const target = event.currentTarget;
      if (ref.current) {
        ref.current.nodes([target]);
      }
    };

    return (
      <div
        className={
          "aspect-video w-full cursor-pointer overflow-hidden border border-neutral-300 shadow-2xl"
        }
      >
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              height={window.innerHeight}
              width={window.innerWidth}
              fill="#ffffff"
              id="bg"
              onClick={() => ref.current.nodes([])}
            />
            <Figures
              instrument={instrument}
              handleClick={handleClick}
              rectangles={rectangles}
              circles={circles}
              lines={lines}
            />
            <Transformer ref={ref} />
          </Layer>
        </Stage>
      </div>
    );
  },
);

export default Whiteboard;
