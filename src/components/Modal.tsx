import { useNavigate } from "react-router-dom";

import { FormEvent, JSX, useState } from "react";

import { useName } from "../context/nameContext.tsx";
import { createBoard } from "../firebase/requests.ts";

const Modal = (): JSX.Element => {
  const navigate = useNavigate();

  const { name } = useName();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const boardName = (event.target as HTMLFormElement).boardName.value;

    try {
      setIsLoading(true);
      const boardId = await createBoard(boardName, name);
      navigate(`/board/${boardId}`);
    } catch (error: any) {
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type={"button"}
        title={"Click the button to create the new board"}
        onClick={() => setIsModalOpen(true)}
        className={"custom-button !w-fit"}
      >
        Create new board
      </button>
      {isModalOpen && (
        <>
          <div className={"fixed inset-0 bg-black bg-opacity-50"} />
          <div
            className={
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform space-y-4 rounded-md bg-white p-6"
            }
          >
            <h1 className={"text-2xl font-semibold"}>Create a new board</h1>
            <p className={"text-black-2"}>
              Give the name to your new board and start working on it
            </p>
            <form onSubmit={handleSubmit} className={"space-y-4"}>
              {error && <p className={"font-semibold text-red-500"}>{error}</p>}
              <input
                type={"text"}
                name={"boardName"}
                placeholder={"Board name"}
                required={true}
                className={"custom-input"}
              />
              <div className={"grid grid-cols-2 gap-4"}>
                <button
                  type={"button"}
                  onClick={() => setIsModalOpen(false)}
                  className={"custom-button-error"}
                >
                  Cancel
                </button>
                <button
                  type={"submit"}
                  disabled={isLoading}
                  className={"custom-button"}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Modal;
