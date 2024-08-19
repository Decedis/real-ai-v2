import { useEffect, useState } from "react";
import { FormData } from "../utils/types";
import { postForm } from "../utils/serverActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const Form = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    content: "",
    email: "",
    createdAt: new Date().toISOString(),
  });
  const queryClient = useQueryClient();
  const { mutateAsync: postFormMutation } = useMutation({
    mutationFn: postForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFormData((prev) => ({
        ...prev,
        createdAt: new Date().toISOString(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <form
        className="w-60 border-cyan-400 bg-cyan-300 border-2 rounded-md p-4 mx-auto mt-6"
        action=""
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Submitting:", formData);
          // try {
          //   await postFormMutation(formData);
          //   setFormData({
          //     content: "",
          //     email: "",
          //     createdAt: new Date().toISOString(),
          //   });
          // } catch (error) {
          //   console.error(error);
          // }
        }}
      >
        <label className="block text-xl" htmlFor="form">
          Inquiry Form:
        </label>

        <label className="block mt-4" htmlFor="email">
          Name
        </label>
        <input
          className="border-gray-400 border-2 p-2 rounded-md"
          type="name"
          name="name"
          id="name"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }));
          }}
        />
        <label className="block mt-4" htmlFor="email">
          Email
        </label>
        <input
          className="border-gray-400 border-2 p-2 rounded-md"
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev) => ({ ...prev, email: e.target.value }));
          }}
        />

        <label className="block mt-4" htmlFor="inquiry">
          Inquiry
        </label>
        <input
          className="border-gray-400 border-2 p-2 rounded-md h-auto"
          type="text"
          name="inquiry"
          id="inquiry"
          value={formData.content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prevData) => ({
              ...prevData,
              content: e.target.value,
            }));
          }}
        ></input>
        <button
          className="bg-cyan-600 p-2 text-white rounded-lg my-2"
          type="submit"
          onClick={async () => {
            try {
              await postFormMutation(formData);
              setFormData({
                name: "",
                content: "",
                email: "",
                createdAt: new Date().toISOString(),
              });
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Submit
        </button>
      </form>
    </>
  );
};
