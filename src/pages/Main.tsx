import { Link } from "react-router-dom";

import { JSX } from "react";

const list = [
  {
    id: 0,
    name: "Board 1",
    createdAt: "2021-09-01",
  },
  {
    id: 1,
    name: "Board 2",
    createdAt: "2021-09-02",
  },
  {
    id: 2,
    name: "Board 3",
    createdAt: "2021-09-03",
  },
];

const MainPage = (): JSX.Element => {
  return (
    <main className={"container mx-auto space-y-6 px-5 py-6"}>
      <h2 className={"text-lg font-medium text-neutral-500"}>
        There are <span className={"text-green-600"}>{list.length} boards</span>{" "}
        available to join
      </h2>
      <ul className={"space-y-3"}>
        {list.map((item) => {
          return (
            <li
              key={item.id}
              className={
                "flex items-center justify-between rounded-md border border-neutral-300 px-2 font-medium"
              }
            >
              <Link to={"/board/1"} className={"block flex-1 py-5"}>
                {item.name}
              </Link>
              <div className={"flex items-center gap-2"}>
                <p>Created at: {item.createdAt}</p>
                <button
                  type={"button"}
                  className={
                    "rounded-md bg-red-500 p-2 text-white hover:bg-red-600 active:bg-red-700"
                  }
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default MainPage;
