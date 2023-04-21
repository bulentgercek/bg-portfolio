import { useEffect, useMemo, useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider, useParams } from "react-router-dom";

import AppContext from "./AppContext";
import AppLayout from "./layouts/AppLayout";
import { Api } from "./api";
import { RouteData } from "./pages";
import { Category, Item } from "./api/interfaces";
import { getCategoryById, getBreadcrumbs } from "../utils";

/**
 * App DAL Function Component for React Context
 * Using : AppContext->AppProps
 */
const AppData: React.FC = () => {
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [dbItems, setDbItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * onRender: Set route variables
   */
  const { cid = null, iid = null } = useParams();

  const routeData: RouteData = useMemo(() => {
    return {
      cid: cid !== null ? parseInt(cid, 10) : null,
      iid: iid !== null ? parseInt(iid, 10) : null,
    };
  }, [cid, iid]);

  const activeCategory = getCategoryById(dbCategories, routeData.cid) || null;
  const breadcrumbs = getBreadcrumbs(dbCategories, activeCategory);

  /**
   * onMount: Fetch dbCategories
   */
  useEffect(() => {
    const fetchData = async () => {
      const fetchCategories = await Api.getCategories();
      setDbCategories(fetchCategories);

      const fetchItems = await Api.getItems();
      setDbItems(fetchItems);

      // Delay for to see loading longer
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ dbCategories, dbItems, loading, routeData, breadcrumbs }}>
      <AppLayout />
    </AppContext.Provider>
  );
};

/**
 * App Router Function Component
 * @returns Router
 */
const App: React.FC = () => {
  // Creating Main Router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppData />,
    },
    {
      path: "/category/:cid",
      element: <AppData />,
    },
    {
      path: "/category/:cid/item/:iid",
      element: <AppData />,
    },
    {
      path: "/item/:iid",
      element: <AppData />,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
