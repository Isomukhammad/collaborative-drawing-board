import { Route, Routes } from "react-router-dom";

import { JSX } from "react";

import Header from "./components/Header.tsx";
import NameModal from "./components/NameModal.tsx";
import { NameProvider } from "./context/nameContext.tsx";
import BoardPage from "./pages/Board.tsx";
import MainPage from "./pages/Main.tsx";

const App = (): JSX.Element => {
  return (
    <NameProvider>
      <Routes>
        <Route path={"/"} element={<MainPage />} />
        <Route path={"/board/:id"} element={<BoardPage />} />
      </Routes>
      <NameModal />
    </NameProvider>
  );
};

export default App;
