export interface IShape {
  id: string;
  x: number;
  y: number;
  color: string;
  stroke: string;
  shape: "square" | "circle" | "line";
  createdAt: number;
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

export interface IBoard {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  shapes: {
    rectangles: IRectangle[];
    circles: ICircle[];
    lines: ILine[];
  };
}

export interface IShapes {
  rectangles: IRectangle[];
  circles: ICircle[];
  lines: ILine[];
}
