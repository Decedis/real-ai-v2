import { useContext } from "react";
import { UserContext } from "../Providers/UserContextProvider.tsx";

export const UserContextButton = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  return (
    <button
      className={
        userContext === "client"
          ? "bg-cyan-400 m-2 p-2 rounded-md"
          : "bg-amber-400 m-2 p-2 rounded-md"
      }
      onClick={() =>
        setUserContext((prev) => (prev === "client" ? "agent" : "client"))
      }
    >
      {userContext}
    </button>
  );
};
