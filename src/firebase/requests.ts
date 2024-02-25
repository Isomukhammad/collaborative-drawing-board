import { child, get, ref, remove, set } from "firebase/database";

import { IBoard, ICircle, ILine, IRectangle } from "../types.ts";
import { realtimeDatabase } from "./firebase.ts";

export const createBoard = async (
  boardName: string,
  createdBy: string,
): Promise<string> => {
  if (!boardName) throw new Error("Board name is required");

  const boardsRef = ref(realtimeDatabase, "boards");
  const boardRef = child(boardsRef, boardName);
  const createdAt = new Date().toISOString();

  const snapshot = await get(boardRef);
  if (snapshot.exists()) throw new Error("Board already exists");

  await set(boardRef, { name: boardName, createdBy, createdAt });

  if (boardRef.key === null) throw new Error("Board creation failed");

  return boardRef.key;
};

export const getBoards = async (): Promise<IBoard[]> => {
  const boardsRef = ref(realtimeDatabase, "boards");
  const snapshot = await get(boardsRef);
  const boardsData = snapshot.val();
  return Object.keys(boardsData).map((key) => ({
    id: key,
    ...boardsData[key],
  }));
};

export const getShapesOfBoard = async (boardId: string) => {
  if (!boardId) throw new Error("Board id is required");

  const boardRef = ref(realtimeDatabase, `boards/${boardId}`);
  const snapshot = await get(boardRef);
  const boardData = snapshot.val();
  if (!boardData) throw new Error("Board not found");
  return Object.values(boardData.shapes) as IRectangle[] | ICircle[] | ILine[];
};

export const deleteBoard = async (boardId: string): Promise<void> => {
  if (!boardId) throw new Error("Board id is required");

  const boardsRef = ref(realtimeDatabase, "boards");

  try {
    await set(child(boardsRef, boardId), null);
  } catch (error) {
    throw new Error(`Failed to delete board: ${error.message}`);
  }
};

export const createShape = async (
  boardId: string,
  uuid: string,
  shape: IRectangle | ICircle | ILine,
): Promise<IRectangle | ICircle | ILine> => {
  const shapesRef = ref(realtimeDatabase, `boards/${boardId}/shapes`);
  try {
    await set(child(shapesRef, uuid), shape);
  } catch (error) {
    throw new Error(`Failed to create shape: ${error.message}`);
  }
};

export const removeShape = async (boardId: string, shapeId: string) => {
  const shapeRef = ref(realtimeDatabase, `boards/${boardId}/shapes/${shapeId}`);
  await remove(shapeRef);
};
