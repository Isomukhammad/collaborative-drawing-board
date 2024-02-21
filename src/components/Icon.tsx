import { JSX, SVGProps } from "react";

export type ISprites = "eraser" | "circle" | "pencil" | "square" | "select";
interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: ISprites;
  className?: string;
}

const Icon = ({ name, className, ...otherProps }: IconProps): JSX.Element => {
  return (
    <svg className={`inline-block ${className}`} {...otherProps}>
      <use xlinkHref={`/sprites.svg#${name}`} />
    </svg>
  );
};

export default Icon;
