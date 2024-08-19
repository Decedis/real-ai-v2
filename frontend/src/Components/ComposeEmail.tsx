import { useLocation } from "react-router-dom";
import { NavBar } from "./NavBar";
import { useQuery } from "@tanstack/react-query";
import { generateEmail, getData } from "../utils/serverActions";
import { useEffect, useState } from "react";

export function ComposeEmail() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const clientID = searchParams.get("id");
  const { data: clientSubmissions, isLoading } = useQuery({
    queryFn: () => getData(clientID ? parseInt(clientID) : undefined),
    queryKey: ["clientSubmissions"],
  });
  const [draft, setDraft] = useState("");

  console.log("clientID", clientID);

  useEffect(() => {
    const generateEmailAsync = async () => {
      if (clientID !== null) {
        const generatedEmail = await generateEmail(parseInt(clientID));
        setDraft(generatedEmail.email);
      }
      console.log("draft", draft);
    };
    console.log("generateEmailAsync", generateEmailAsync.name);
    generateEmailAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientID]);

  if (isLoading) {
    return <>...Loading</>;
  }
  if (!email) {
    return <>...No Email</>;
  }

  return (
    <>
      <NavBar />
      <form
        className="flex flex-col"
        action=""
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label className={"text-2xl text-center block w-full m-6"}>
          Compose Email
        </label>
        <div className="border-2 border-violet-400 m-2 p-4 rounded-lg flex flex-col gap-2">
          <div className="flex w-full rounded-sm border-2 border-gray-400 p-2">
            {email}
          </div>

          <textarea
            className="border-2 border-violet-400 w-full min-h-[100px] p-2 rounded-md"
            name="email"
            id="email"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={Math.max(5, draft.split("\n").length)}
          ></textarea>
        </div>
        <button
          className="bg-cyan-600 p-2 text-white rounded-lg m-4 w-16 self-end"
          type="submit"
        >
          Send
        </button>
      </form>

      <div
        className={
          "border-2 border-violet-400 m-2 p-4 rounded-lg flex flex-col gap-2 "
        }
      >
        {clientSubmissions?.map((submission, index) => (
          <div
            className="border-2 border-violet-500 m-2 p-2 rounded-md"
            key={index}
          >
            <div>{submission.content}</div>
            <div className="border-b-orange-500 border-b-2 w-1/6 p-2">
              - {submission.name}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
