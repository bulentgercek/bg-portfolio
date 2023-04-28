import { createContext } from "react";
import { Category, Item } from "./api/interfaces";
import { NavElement, RouteData } from "./pages";

export type AppProps = {
  dbCategories: Category[];
  dbItems: Item[];
  loading: boolean;
  routeData: RouteData;
  breadcrumbs: Category[];
  contentSizeData?: DOMRectReadOnly;
  navData: NavElement[]; // for useState
  setNavData: (data: NavElement[]) => void; // for useState
};

// Default values for AppProps
const AppContext = createContext<AppProps>({
  dbCategories: [],
  dbItems: [],
  loading: true,
  routeData: { cid: null, iid: null },
  breadcrumbs: [],
  navData: [],
  setNavData: () => {},
});

export default AppContext;
