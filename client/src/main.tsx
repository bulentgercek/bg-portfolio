import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./pages/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout value="home" />,
  },
  {
    path: "/about",
    element: <Layout value="about" />,
  },
  {
    path: "/works",
    element: <Layout value="works" />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>,
  </React.StrictMode>,
);
