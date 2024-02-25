import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface NameContextProps {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}

const NameContext = createContext<NameContextProps>({
  name: "",
  setName: () => {},
});

const NameProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string>(
    sessionStorage.getItem("username") ?? "",
  );

  return (
    <NameContext.Provider value={{ name, setName }}>
      {children}
    </NameContext.Provider>
  );
};

const useName = () => {
  const context = useContext(NameContext);
  if (context === undefined) {
    throw new Error("useName must be used within a NameProvider");
  }
  return context;
};

export { NameProvider, useName };
