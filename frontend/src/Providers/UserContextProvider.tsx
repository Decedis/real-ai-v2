import React, {
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

export const UserContext = createContext<TUserContext>({} as TUserContext);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize userContext from localStorage directly
  const [userContext, setUserContext] = useState<"client" | "agent">(() => {
    const storedUserContext = localStorage.getItem("userContext");
    return storedUserContext === "client" || storedUserContext === "agent"
      ? storedUserContext
      : "client";
  });

  useEffect(() => {
    // Sync localStorage whenever userContext changes
    localStorage.setItem("userContext", userContext);
  }, [userContext]);

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
