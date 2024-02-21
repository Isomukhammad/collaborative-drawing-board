import { ISprites } from "./components/Icon.tsx";

export interface IInstrument {
  id: number;
  name: string;
  icon: ISprites;
}

export const instruments: IInstrument[] = [
  {
    id: 0,
    name: "select",
    icon: "select",
  },
  {
    id: 1,
    name: "pencil",
    icon: "pencil",
  },
  {
    id: 2,
    name: "circle",
    icon: "circle",
  },
  {
    id: 3,
    name: "square",
    icon: "square",
  },
  {
    id: 4,
    name: "eraser",
    icon: "eraser",
  },
];
