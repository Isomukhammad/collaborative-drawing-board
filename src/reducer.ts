import { useState } from "react";

import { ISprites } from "./components/Icon.tsx";

interface IShape {
  id: string;
  x: number;
  y: number;
  color: string;
  stroke: string;
}

export interface IRectangle extends IShape {
  width: number;
  height: number;
}

export interface ICircle extends IShape {
  radius: number;
}

export interface ILine extends IShape {
  points: number[];
  fill: string;
}

interface IInitialState {
  instrument: ISprites;
  rectangles: IRectangle[] | [];
  circles: ICircle[] | [];
  lines: ILine[] | [];
}

const initialState: IInitialState = {
  instrument: "select",
  rectangles: [],
  circles: [],
  lines: [],
};

export const ACTION_TYPES = {
  SET_INSTRUMENT: "SET_INSTRUMENT",
  ADD_RECTANGLE: "ADD_RECTANGLE",
  ADD_CIRCLE: "ADD_CIRCLE",
  ADD_LINE: "ADD_LINE",
};

export const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
