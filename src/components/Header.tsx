import { Link } from "react-router-dom";

import { JSX } from "react";

const Header = ({ name }: { name: string }): JSX.Element => {
  return (
    <header className={"rounded-b-xl bg-white shadow"}>
      <div
        className={
          "container mx-auto flex flex-row items-center justify-between px-5 py-4"
        }
      >
        <Link to={"/"} title={"Main page"} className={"text-lg font-semibold"}>
          Collaborative drawing
        </Link>
        {name && (
          <p>
            Welcome, <span className={"font-semibold"}>{name}</span>
          </p>
        )}
      </div>
    </header>
  );
};

export default Header;
