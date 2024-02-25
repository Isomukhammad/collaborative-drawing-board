import {
  ref as firebaseRef,
  off,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from "firebase/database";
import Konva from "konva";
import { Layer, Rect, Stage } from "react-konva";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import {
  Dispatch,
  JSX,
  SetStateAction,
  forwardRef,
  useEffect,
  useRef,
} from "react";

import { instruments } from "../constant.ts";
import { realtimeDatabase } from "../firebase/firebase.ts";
import {
  createShape,
  getShapesOfBoard,
  removeShape,
} from "../firebase/requests.ts";
import { useShapes } from "../hooks/useShapes.ts";
import { ICircle, ILine, IRectangle } from "../types.ts";
import DownloadBtn from "./DownloadBtn.tsx";
import Figures from "./Figures.tsx";

interface WhiteboardProps {
  instrument: (typeof instruments)[number];
  fillColor: string;
  strokeColor: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const Whiteboard = forwardRef<Konva.Transformer, WhiteboardProps>(
  ({ instrument, fillColor, strokeColor, setIsLoading }, ref): JSX.Element => {
    const { id: boardId } = useParams();

    const { shapes, setShapes } = useShapes(String(boardId), setIsLoading);
    const stageRef = useRef<Konva.Stage | null>(null);
    const isDrawing = useRef<boolean>(false);
    const currentShapeId = useRef<string>("");

    useEffect(() => {
      const shapesRef = firebaseRef(
        realtimeDatabase,
        `boards/${boardId}/shapes`,
      );

      const handleShapeAdded = async (): Promise<void> => {
        try {
          const allShapes = await getShapesOfBoard(String(boardId)).then(
            (res) => res.sort((a, b) => a.createdAt - b.createdAt),
          );
          setShapes(allShapes);
        } catch (error) {
          console.error("Error fetching shapes:", error);
        }
      };

      const handleShapeChanged = (snapshot: any) => {
        const updatedShape = snapshot.val();
        setShapes((prevShapes) =>
          prevShapes.map((shape) =>
            shape.id === updatedShape.id ? updatedShape : shape,
          ),
        );
      };

      const handleShapeRemoved = (snapshot: any) => {
        const removedShapeId = snapshot.key;
        const newShapes = shapes.filter(
          (shape) => shape.id !== removedShapeId,
        ) as IRectangle[] | ICircle[] | ILine[];
        setShapes(newShapes);
      };

      onChildAdded(shapesRef, handleShapeAdded);
      onChildChanged(shapesRef, handleShapeChanged);
      onChildRemoved(shapesRef, handleShapeRemoved);

      return () => {
        off(shapesRef, "child_added", handleShapeAdded);
        off(shapesRef, "child_changed", handleShapeChanged);
        off(shapesRef, "child_removed", handleShapeRemoved);
      };
    }, [boardId]);

    const updateShape = (
      updateFunc: (
        shape: IRectangle | ICircle | ILine,
      ) => IRectangle | ICircle | ILine,
    ) => {
      const shape = shapes.find(
        (shape) => shape.id === currentShapeId.current,
      ) as IRectangle | ICircle | ILine;
      setShapes((prevShapes) => {
        const index = prevShapes.findIndex(
          (shape) => shape.id === currentShapeId.current,
        );
        const newShapes: (IRectangle | ICircle | ILine)[] = [...prevShapes];
        newShapes[index] = updateFunc(newShapes[index]);
        return newShapes as IRectangle[] | ICircle[] | ILine[];
      });
      createShape(String(boardId), shape.id, shape);
    };

    const onPointerDown = () => {
      if (instrument.name === "select") return;
      const stage = stageRef.current;
      if (stage) {
        if (instrument.name !== "eraser") {
          const pointerPosition = stage.getPointerPosition();
          if (!pointerPosition) return;
          const { x, y } = pointerPosition;
          const id = uuidv4();

          currentShapeId.current = id;
          isDrawing.current = true;

          let newShape: IRectangle | ICircle | ILine;
          switch (instrument.name) {
            case "square":
              newShape = {
                id,
                x,
                y,
                width: 0,
                height: 0,
                color: fillColor,
                stroke: strokeColor,
                shape: "square",
                createdAt: Date.now(),
              };
              break;
            case "circle":
              newShape = {
                id,
                x,
                y,
                radius: 0,
                color: fillColor,
                stroke: strokeColor,
                shape: "circle",
                createdAt: Date.now(),
              };
              break;
            case "pencil":
              newShape = {
                id,
                x,
                y,
                points: [x, y],
                color: fillColor,
                stroke: fillColor,
                fill: fillColor,
                shape: "line",
                createdAt: Date.now(),
              };
              break;
            default:
              return;
          }

          setShapes((prevShapes: (IRectangle | ICircle | ILine)[]) => {
            const newShapes: (IRectangle | ICircle | ILine)[] = [
              ...prevShapes,
              newShape,
            ];
            return newShapes as IRectangle[] | ICircle[] | ILine[];
          });
        } else {
          const shapePointer = stage.getPointerPosition() as Konva.Vector2d;
          const shape = stage.getIntersection(shapePointer);
          if (shape && shape.id() !== "bg") {
            shape.remove();
            removeShape(String(boardId), shape.id());
          }
        }
      }
    };

    const onPointerMove = () => {
      if (!isDrawing.current) return;

      const stage = stageRef.current;
      if (!stage) return;
      if (instrument.name === "eraser") return;
      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) return;
      const { x, y } = pointerPosition;

      switch (instrument.name) {
        case "square":
          setShapes((prevShapes) => {
            const index = prevShapes.findIndex(
              (shape) => shape.id === currentShapeId.current,
            );
            const newShapes = [...prevShapes];
            newShapes[index] = {
              ...newShapes[index],
              width: x - newShapes[index].x,
              height: y - newShapes[index].y,
            };
            return newShapes as IRectangle[];
          });
          break;
        case "circle":
          setShapes((prevShapes: (IRectangle | ICircle | ILine)[]) => {
            const index = prevShapes.findIndex(
              (shape) => shape.id === currentShapeId.current,
            );
            const newShapes = [...prevShapes];
            newShapes[index] = {
              ...newShapes[index],
              radius: Math.sqrt(
                Math.pow(x - newShapes[index].x, 2) +
                  Math.pow(y - newShapes[index].y, 2),
              ),
            };
            return newShapes as ICircle[];
          });
          break;
        case "pencil":
          setShapes((prevShapes) => {
            const index = prevShapes.findIndex(
              (shape) => shape.id === currentShapeId.current,
            );
            const newShapes = [...prevShapes] as ILine[];
            newShapes[index] = {
              ...newShapes[index],
              points: [...newShapes[index].points, x, y],
            };
            return newShapes;
          });
          break;
        default:
          return;
      }
    };

    const onPointerUp = () => {
      if (!isDrawing.current) return;

      const stage = stageRef.current;
      if (!stage) return;
      if (instrument.name === "eraser") return;
      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) return;
      const { x, y } = pointerPosition;

      const shapeUpdates: {
        [key: string]: (
          shape: IRectangle | ICircle | ILine,
        ) => IRectangle | ICircle | ILine;
      } = {
        square: (shape) => ({
          ...shape,
          width: x - shape.x,
          height: y - shape.y,
        }),
        circle: (shape) => ({
          ...shape,
          radius: Math.sqrt(
            Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2),
          ),
        }),
        pencil: (shape: IRectangle | ICircle | ILine) => {
          if ("points" in shape) {
            return { ...shape, points: [...shape.points, x, y] };
          }
          return shape;
        },
      };

      if (shapeUpdates[instrument.name]) {
        updateShape(shapeUpdates[instrument.name]);
      }

      isDrawing.current = false;
    };

    const handleClick = (event: Konva.KonvaEventObject<MouseEvent>): void => {
      if (instrument.name !== "select") return;
      const target = event.currentTarget;
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.nodes([target]);
      }
    };

    return (
      <>
        <DownloadBtn ref={stageRef} />
        <div
          className={
            "aspect-video w-screen cursor-pointer overflow-hidden border border-neutral-300 shadow-2xl"
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
                onClick={() => {
                  if (ref && typeof ref !== "function" && ref.current) {
                    ref.current.nodes([]);
                  }
                }}
              />
              <Figures
                instrument={instrument}
                handleClick={handleClick}
                shapes={shapes}
              />
            </Layer>
          </Stage>
        </div>
      </>
    );
  },
);

export default Whiteboard;
