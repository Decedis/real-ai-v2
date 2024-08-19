import { ClientData, FormData, GeneratedDocuments } from "./types";

const baseURL = "http://localhost:3000";

export async function getData(clientId?: number): Promise<FormData[]> {
  let url = baseURL + "/api/submissions";
  if (clientId) {
    url += `?clientId=${clientId}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json: FormData[] = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const postForm = async (submission: Omit<FormData, "id">) => {
  const res = await fetch(baseURL + "/api/submissions", {
    // => /api/submissions
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submission),
  });
  return (await res.json()) as Promise<FormData[]>;
};

export const getDocument = async (): Promise<GeneratedDocuments[]> => {
  const url = baseURL + "/api/documents";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log("API response:", json);

    if (json && Array.isArray(json.documents)) {
      return json.documents;
    } else {
      console.error("Unexpected response structure:", json);
      return [];
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
};

export async function getClientData(): Promise<ClientData[]> {
  const url = baseURL + "/api/clients";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    const clients: ClientData[] = data.clients;
    console.log(clients);
    return clients;
  } catch (error) {
    console.error(error);
    return [];
  }
}

//AI Stuff
export const postDocumentGeneration = async () => {
  return await fetch(baseURL + "/api/generate-document", {
    method: "POST",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
};

export const tagClient = async (clientId?: number) => {
  try {
    const response = await fetch(baseURL + "/api/tag-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientId ? { clientId } : {}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const generateEmail = async (clientId?: number) => {
  try {
    const response = await fetch(baseURL + "/api/generate-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientId ? { clientId } : {}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
