import { useState } from "react";
import { getData } from "../utils/serverActions";
import { useQuery } from "@tanstack/react-query";

export const DataShower = () => {
  const [showReport, setShowReport] = useState(false);
  const { data: formSubmissions, isLoading } = useQuery({
    queryFn: () => getData(),
    queryKey: ["submissions"],
  });

  //console.log("submissionData: ", submissionData);
  console.log("formSubmissions", formSubmissions);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button
        className="m-2 p-2 text-white bg-slate-600 rounded-md"
        onClick={() => setShowReport((prev) => (prev ? false : true))}
      >
        Show Data
      </button>
      <div className={showReport ? "" : "hidden"}>
        {formSubmissions?.map((submission, index) => (
          <div
            className="border-2 rounded-md border-blue-400 p-4 ml-4 mb-4 w-auto bg-blue-400"
            key={index}
          >
            <div className="flex flex-row align-center">
              <div className={"border-2 m-2 p-2 bg-orange-300 rounded-md"}>
                Name:
              </div>
              <div className="border-2 m-2 p-2 border-blue-400 bg-orange-300 rounded-md">
                {submission.name}
              </div>
            </div>

            <div className="flex flex-row align-center">
              <div className={"border-2 m-2 p-2 bg-pink-400 rounded-md"}>
                Email:
              </div>
              <div className="border-2 m-2 p-2 border-blue-400 bg-pink-400 rounded-md">
                {submission.email}
              </div>
            </div>

            <div className="flex flex-row align-center">
              <div className="border-2 m-2 p-2 bg-amber-300 rounded-md">
                Inquiry:{" "}
              </div>
              <div className="border-2 m-2 p-2 border-blue-400 bg-amber-300 rounded-md">
                {submission.content}
              </div>
            </div>

            <div className="flex flex-row align-center">
              <div className="border-2 m-2 p-2 bg-emerald-600 rounded-md">
                Created At:{" "}
              </div>
              <div className="border-2 m-2 p-2 border-blue-400 bg-emerald-600 rounded-md">
                {submission.createdAt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
