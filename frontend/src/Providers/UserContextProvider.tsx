import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type TUserContext = {
  userContext: "client" | "agent";
  setUserContext: Dispatch<SetStateAction<"client" | "agent">>;
};

const defaultContext: TUserContext = {
  userContext: "client",
  setUserContext: () => {},
};

export const UserContext = createContext<TUserContext>(defaultContext);
const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [userContext, setUserContext] = useState<"client" | "agent">("client");

  useEffect(() => {
    const userContext = localStorage.getItem("userContext"); //TODO update
    if (userContext) {
      setUserContext(userContext as "client" | "agent");
    }
  }, []);

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserContextProvider;
