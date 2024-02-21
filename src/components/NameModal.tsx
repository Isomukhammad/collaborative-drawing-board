import { Dispatch, FormEvent, JSX, SetStateAction } from "react";

interface NameModalProps {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}

const NameModal = ({ name, setName }: NameModalProps): JSX.Element | null => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = (event.target as HTMLFormElement).username.value;
    sessionStorage.setItem("username", username);
    setName(username);
  };

  if (name) return null;

  return (
    <div
      className={
        "fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black opacity-75"
      }
    >
      <div className={"space-y-5 rounded-md bg-white px-4 py-6"}>
        <div className={"text-center"}>
          <h2 className={"text-2xl font-bold"}>Welcome</h2>
          <p className={"text-lg font-semibold"}>Enter your name</p>
        </div>
        <form className={"space-y-2"} onSubmit={handleSubmit}>
          <input
            type="text"
            name={"username"}
            placeholder={"Your name"}
            required={true}
            className={"custom-input"}
          />
          <button type={"button"} className={"custom-button"}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameModal;
