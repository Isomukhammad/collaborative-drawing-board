import { Route, Routes } from "react-router-dom";

import { JSX, useState } from "react";

import Header from "./components/Header.tsx";
import NameModal from "./components/NameModal.tsx";
import BoardPage from "./pages/Board.tsx";
import MainPage from "./pages/Main.tsx";

const App = (): JSX.Element => {
  const [name, setName] = useState<string>(
    sessionStorage.getItem("username") ?? "",
  );

  return (
    <>
      <Header name={name} />
      <Routes>
        <Route path={"/"} element={<MainPage />} />
        <Route path={"/board/:id"} element={<BoardPage />} />
      </Routes>
      <NameModal name={name} setName={setName} />
    </>
  );
};

export default App;
