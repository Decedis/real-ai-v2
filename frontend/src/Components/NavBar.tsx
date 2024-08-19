import { useContext } from "react";
import { UserContext } from "../Providers/UserContextProvider.tsx";
import { UserContextButton } from "./UserContextButton.tsx";
import { Link } from "react-router-dom";

export const NavBar = () => {
  const { userContext } = useContext(UserContext);

  if (userContext === "client") {
    return (
      <div className="flex items-center justify-end w-full h-16 bg-amber-200">
        <Link className="m-2 p-2 border-0 rounded-md bg-fuchsia-500" to={"/"}>
          Home
        </Link>
        <UserContextButton />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-end w-full h-16 bg-blue-500">
      <Link
        className="m-2 p-2 border-0 rounded-md bg-lime-500"
        to={"/documents"}
      >
        Inquiries
      </Link>
      <Link
        className="m-2 p-2 border-0 rounded-md bg-emerald-400"
        to={"/address-book"}
      >
        Address Book
      </Link>
      <Link className="m-2 p-2 border-0 rounded-md bg-fuchsia-500" to={"/"}>
        Home
      </Link>
      <UserContextButton />
    </div>
  );
};
