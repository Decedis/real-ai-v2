import { useContext } from "react";
import { UserContext } from "../Providers/UserContextProvider.tsx";
import { NavBar } from "./NavBar.tsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClientData, tagClient } from "../utils/serverActions.ts";
import { ClientData } from "../utils/types.ts";
import { Link } from "react-router-dom";

export const AddressBook = () => {
  const { userContext } = useContext(UserContext);
  const queryClient = useQueryClient();
  const { data: clientData, isLoading } = useQuery({
    queryFn: () => getClientData(),
    queryKey: ["clientData"],
  });
  const tagAllUntaggedClientsMutation = useMutation({
    mutationFn: () => tagClient(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["clients"] });
      await queryClient.cancelQueries({ queryKey: ["taggedClients"] });
      const previousClients = queryClient.getQueryData(["clients"]);
      return { previousClients };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["taggedClients"] });
    },
  });
  const tagIndividualClientMutation = useMutation({
    mutationFn: (clientId: number) => tagClient(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  console.log("clientData: ", clientData);
  if (userContext == "client") {
    return (
      <>
        <NavBar />
      </>
    );
  }
  if (userContext === "agent" && isLoading) {
    return <>...Is Loading</>;
  }
  return (
    <>
      <NavBar />
      <h1
        className={"text-2xl underline-offset-1 underline mx-auto w-1/4 mt-3"}
      >
        Address Book
      </h1>
      <button
        className="m-4 p-2 bg-blue-400 rounded-md"
        onClick={() => tagAllUntaggedClientsMutation.mutate()}
        disabled={tagAllUntaggedClientsMutation.isPending}
      >
        {tagAllUntaggedClientsMutation.isPending
          ? "Tagging..."
          : "Tag All Untagged Clients"}
      </button>
      {Array.isArray(clientData) &&
        clientData?.map((doc: ClientData) => (
          <div
            className={"border-2 border-red-300 rounded-md m-4 p-2"}
            key={doc.id}
          >
            <div className="flex">
              <button
                className={
                  "border-2 border-orange-500 p-2 m-2 rounded-md bg-orange-300"
                }
                onClick={() =>
                  doc.tag === null
                    ? tagIndividualClientMutation.mutate(doc.id)
                    : doc.tag
                }
                disabled={
                  doc.tag ? true : tagIndividualClientMutation.isPending
                }
              >
                #{doc.tag}
              </button>
              <Link
                to={`/email?email=${doc.email}&id=${doc.id}`}
                className={"border-2 border-blue-400 p-2  m-2 rounded-md"}
              >
                {doc.email}
              </Link>
            </div>
            <div className={"border-2 border-blue-400 p-2  m-2 rounded-md"}>
              {doc.name}
            </div>

            <div className={"border-2 border-blue-400 p-2  m-2 rounded-md"}>
              {doc.createdAt}
            </div>
            <div
              className={
                "border-2 border-amber-200 p-2  m-2 rounded-md bg-amber-200"
              }
            >
              Agent:{" "}
              {doc.agent?.name ? doc.agent.name : "Agent not yet assigned"}
            </div>
          </div>
        ))}
    </>
  );
};
