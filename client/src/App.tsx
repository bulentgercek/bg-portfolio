import { useContext, useEffect, useMemo, useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider, useParams } from "react-router-dom";

import AppContext from "./AppContext";
import AppLayout from "./layouts/AppLayout";
import { Api } from "./api";
import { NavElement, RouteData } from "./pages";
import { Category, Item } from "./api/interfaces";
import { getCategoryById } from "./utils/categoryUtils";
import { getBreadcrumbs } from "./utils/appUtils";

/**
 * App DAL Function Component for React Context
 * Using : AppContext->AppProps
 */
const AppData: React.FC = () => {
  const [dbCategories, setDbCategories] = useState<Category[] | null>(null);
  const [dbItems, setDbItems] = useState<Item[] | null>(null);
  const [dbLoading, setDbLoading] = useState<boolean>(true);
  const [navData, setNavData] = useState<NavElement[] | null>(null);

  const context = useContext(AppContext);
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

  /**
   * onUpdate params or dbCategories: Set breadcrumbs
   */
  const breadcrumbs: Category[] = useMemo(() => {
    if (dbCategories === null) return [];
    const activeCategory = getCategoryById(dbCategories, routeData.cid) ?? null;
    return getBreadcrumbs(dbCategories, activeCategory);
  }, [cid, iid, dbCategories]);

  /**
   * onMount: Fetch dbCategories and dbItems
   */
  useEffect(() => {
    const fetchData = async () => {
      const fetchCategories = await Api.getCategories();
      setDbCategories(fetchCategories);

      const fetchItems = await Api.getItems();
      setDbItems(fetchItems);
      setDbLoading(false);
    };

    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ ...context, dbCategories, dbItems, routeData, breadcrumbs, navData, setNavData }}>
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
