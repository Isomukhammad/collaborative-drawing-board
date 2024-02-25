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

      const handleShapeAdded = async (snapshot): Promise<void> => {
        try {
          const allShapes = await getShapesOfBoard(String(boardId)).then(
            (res) => res.sort((a, b) => a.createdAt - b.createdAt),
          );
          setShapes(allShapes);
        } catch (error) {
          console.error("Error fetching shapes:", error);
        }
      };

      const handleShapeChanged = (snapshot) => {
        const updatedShape = snapshot.val();
        setShapes((prevShapes) =>
          prevShapes.map((shape) =>
            shape.id === updatedShape.id ? updatedShape : shape,
          ),
        );
      };

      const handleShapeRemoved = (snapshot) => {
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
    }, []);

    const updateShape = (shapeType, updateFunc) => {
      const shape = shapes.find(
        (shape) => shape.id === currentShapeId.current,
      ) as typeof shapeType;
      setShapes((prevShapes) => {
        const index = prevShapes.findIndex(
          (shape) => shape.id === currentShapeId.current,
        );
        const newShapes = [...prevShapes];
        newShapes[index] = updateFunc(newShapes[index]);
        return newShapes;
      });
      createShape(String(boardId), shape.id, shape);
    };

    const onPointerDown = () => {
      if (instrument.name === "select") return;
      const stage = stageRef.current;
      if (stage) {
        if (instrument.name !== "eraser") {
          const { x, y } = stage.getPointerPosition();
          const id = uuidv4();

          currentShapeId.current = id;
          isDrawing.current = true;

          let newShape;
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
                points: [x, y],
                stroke: fillColor,
                fill: fillColor,
                shape: "line",
                createdAt: Date.now(),
              };
              break;
            default:
              return;
          }

          setShapes((prevShapes) => [...prevShapes, newShape]);
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
      const { x, y } = stage.getPointerPosition();

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
            return newShapes;
          });
          break;
        case "circle":
          setShapes((prevShapes) => {
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
            return newShapes;
          });
          break;
        case "pencil":
          setShapes((prevShapes) => {
            const index = prevShapes.findIndex(
              (shape) => shape.id === currentShapeId.current,
            );
            const newShapes = [...prevShapes];
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
      const { x, y } = stage.getPointerPosition();

      const shapeUpdates = {
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
        pencil: (shape) => ({ ...shape, points: [...shape.points, x, y] }),
      };

      if (shapeUpdates[instrument.name]) {
        updateShape(instrument.name, shapeUpdates[instrument.name]);
      }

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
              shapes={shapes}
            />
          </Layer>
        </Stage>
      </div>
    );
  },
);

export default Whiteboard;
