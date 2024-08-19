import { GeneratedDocuments } from "../utils/types";
import { getDocument } from "../utils/serverActions";
import { useQuery } from "@tanstack/react-query";
import { DocumentGenerator } from "./DocumentGenerator.tsx";
import { DataShower } from "./DataShower.tsx";
import { NavBar } from "./NavBar.tsx";

export const Documents = () => {
  const {
    isLoading,
    error,
    data: fetchedDocuments,
  } = useQuery({
    initialData: [] as GeneratedDocuments[],
    queryKey: ["generatedDocuments"],
    queryFn: () => getDocument(),
  });

  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <NavBar />
      <DataShower />
      <DocumentGenerator />
      {fetchedDocuments.length > 0 ? (
        fetchedDocuments.map((doc: GeneratedDocuments) => (
          <div
            className="m-4 p-6 border-4 border-red-300 bg-red-300 rounded-md"
            key={doc.id}
          >
            <div className="m-2 p-2 border-2 border-red-300 bg-white rounded-md">
              {doc.content}
            </div>
            <div className="m-2 p-2 border-2 border-emerald-500 bg-emerald-500 rounded-md">
              {doc.createdAt.toString()}
            </div>
          </div>
        ))
      ) : (
        <div>No documents available</div>
      )}
    </div>
  );
};

export default Documents;
