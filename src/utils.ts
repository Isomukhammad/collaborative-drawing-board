import Konva from "konva";

import { instruments } from "./constant.ts";

interface HandleTransformEndValues {
  instrument: (typeof instruments)[number];
  whiteboardRef: Konva.Transformer;
  boardId: string;
}

export const handleTransformEnd = ({
  instrument,
  whiteboardRef,
  boardId,
}: HandleTransformEndValues): void => {
  if (instrument.name !== "select") return;

  const transformer = whiteboardRef.current;
  if (!transformer) return;

  const shapeNode = transformer.nodes()[0];
  if (!shapeNode) return;

  let updatedShape;
  switch (shapeNode.attrs.shape) {
    case "rectangle":
      updatedShape = {
        id: shapeNode.id(),
        x: shapeNode.x(),
        y: shapeNode.y(),
        rotation: shapeNode.rotation(),
        scaleX: shapeNode.scaleX(),
        scaleY: shapeNode.scaleY(),
        width: shapeNode.width() * shapeNode.scaleX(),
        height: shapeNode.height() * shapeNode.scaleY(),
        color: shapeNode.fill(),
        stroke: shapeNode.stroke(),
        shape: "rectangle",
      };
      break;
    case "circle":
      updatedShape = {
        id: shapeNode.id(),
        x: shapeNode.x(),
        y: shapeNode.y(),
        rotation: shapeNode.rotation(),
        scaleX: shapeNode.scaleX(),
        scaleY: shapeNode.scaleY(),
        radius: shapeNode.radius() * shapeNode.scaleX(),
        color: shapeNode.fill(),
        stroke: shapeNode.stroke(),
        shape: "circle",
      };
      break;
    case "line":
      updatedShape = {
        id: shapeNode.id(),
        points: shapeNode.points(),
        stroke: shapeNode.stroke(),
        fill: shapeNode.fill(),
        shape: "line",
      };
      break;
    default:
      return;
  }

  return updatedShape;
};
