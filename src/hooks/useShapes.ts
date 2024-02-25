import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { getShapesOfBoard } from "../firebase/requests.ts";
import { ICircle, ILine, IRectangle } from "../types.ts";

type SetLoading = Dispatch<SetStateAction<boolean>>;

export const useShapes = (boardId: string, setIsLoading: SetLoading) => {
  const [shapes, setShapes] = useState<IRectangle[] | ICircle[] | ILine[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const boardShapes = await getShapesOfBoard(boardId);
        setShapes(boardShapes);
      } catch (error) {
        console.error("Error fetching shapes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { shapes, setShapes };
};
