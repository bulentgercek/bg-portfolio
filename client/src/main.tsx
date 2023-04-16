import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import SidebarMenu from "./gpt/SidebarMenuItem";

export type QueryStringParams = {
  cid: string;
  iid: string;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
  },
  {
    path: "/category/:cid",
    element: <Layout />,
  },
  {
    path: "/category/:cid/item/:iid",
    element: <Layout />,
  },
  {
    path: "/item/:iid",
    element: <Layout />,
  },
  {
    path: "/gpt/*",
    element: <SidebarMenu />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={router}></RouterProvider>,
  // </React.StrictMode>,
);
