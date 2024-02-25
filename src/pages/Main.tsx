import { off, onChildAdded, onChildRemoved, ref } from "firebase/database";
import { Link } from "react-router-dom";

import { JSX, useEffect, useState } from "react";

import Header from "../components/Header.tsx";
import Modal from "../components/Modal.tsx";
import { realtimeDatabase } from "../firebase/firebase.ts";
import { deleteBoard, getBoards } from "../firebase/requests.ts";
import { IBoard } from "../types.ts";

const MainPage = (): JSX.Element => {
  const [boards, setBoards] = useState<IBoard[]>([]);

  useEffect(() => {
    const boardsRef = ref(realtimeDatabase, "boards");

    getBoards().then((data) => setBoards(data));
    const handleBoardAdded = (snapshot: any) => {
      const board = { id: snapshot.key, ...snapshot.val() };
      setBoards((prevBoards) => [board, ...prevBoards]);
    };
    const handleBoardRemoved = (snapshot: any) => {
      setBoards((prevBoards) =>
        prevBoards.filter((board) => board.id !== snapshot.key),
      );
    };

    onChildAdded(boardsRef, handleBoardAdded);
    onChildRemoved(boardsRef, handleBoardRemoved);

    return () => {
      off(boardsRef, "child_added", handleBoardAdded);
      off(boardsRef, "child_removed", handleBoardRemoved);
    };
  }, []);

  return (
    <>
      <Header />
      <main className={"container mx-auto space-y-6 px-5 py-6"}>
        <div className={"flex items-center justify-between"}>
          <h2 className={"text-lg font-medium text-neutral-500"}>
            There are{" "}
            <span className={"text-green-600"}>{boards.length} boards</span>{" "}
            available to join
          </h2>
          <Modal />
        </div>
        <ul className={"space-y-3"}>
          {boards.map((item) => {
            const createdAt = new Date(item.createdAt).toLocaleString();

            return (
              <li
                key={item.id}
                className={
                  "flex items-center justify-between rounded-md border border-neutral-300 px-2 font-medium"
                }
              >
                <Link
                  to={`/board/${item.name}`}
                  className={"flex flex-1 flex-col py-5"}
                >
                  <span className={"text-lg"}>{item.name}</span>{" "}
                  <span className={"text-sm text-neutral-400"}>
                    Created by: {item.createdBy}
                  </span>
                </Link>
                <div className={"flex items-center gap-2"}>
                  <p>Created at: {createdAt}</p>
                  <button
                    type={"button"}
                    onClick={() => deleteBoard(item.id)}
                    className={"custom-button-error"}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
};

export default MainPage;
