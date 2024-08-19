import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import UserContextProvider from "./Providers/UserContextProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AddressBook } from "./Components/AddressBook.tsx";
import Documents from "./Components/Documents.tsx";
import { ComposeEmail } from "./Components/ComposeEmail.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App />, errorElement: <div>404 not found</div> },
  {
    path: "/address-book",
    element: <AddressBook />,
  },
  {
    path: "/documents",
    element: <Documents />,
  },
  {
    path: "/email",
    element: <ComposeEmail />,
  },
]);
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
