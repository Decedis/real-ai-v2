import { useState } from "react";
import { postDocumentGeneration } from "../utils/serverActions";

export const DocumentGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateDocument = async () => {
    setIsLoading(true);
    try {
      const result = await postDocumentGeneration();
      console.log(result);
      // Handle the result as needed
      setIsLoading(false);
    } catch (err) {
      console.log("Failed to generate document: " + err);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        className="border-red-400 border-2 rounded-md p-2 m-2"
        onClick={handleGenerateDocument}
        disabled={isLoading}
      >
        Generate Document
      </button>
    </div>
  );
};
