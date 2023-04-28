import { createContext } from "react";
import { Category, Item } from "./api/interfaces";
import { NavElement, RouteData } from "./pages";

export type AppProps = {
  dbCategories: Category[] | null;
  dbItems: Item[] | null;
  routeData: RouteData;
  breadcrumbs: Category[];
  contentSizeData?: DOMRectReadOnly;
  navData: NavElement[] | null; // for useState
  setNavData: (data: NavElement[]) => void; // for useState
};

// Default values for AppProps
const AppContext = createContext<AppProps>({
  dbCategories: null,
  dbItems: null,
  routeData: { cid: null, iid: null },
  breadcrumbs: [],
  navData: null,
  setNavData: () => {},
});

export default AppContext;
