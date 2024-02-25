import { ISprites } from "./components/Icon.tsx";

export interface IInstrument {
  id: number;
  name: string;
  icon: ISprites;
}

export const instruments: IInstrument[] = [
  {
    id: 0,
    name: "pencil",
    icon: "pencil",
  },
  {
    id: 1,
    name: "circle",
    icon: "circle",
  },
  {
    id: 2,
    name: "square",
    icon: "square",
  },
];
