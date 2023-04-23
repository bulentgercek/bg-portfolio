import { createContext } from "react";
import { Category, Item } from "./api/interfaces";
import { RouteData } from "./pages";

export type AppProps = {
  dbCategories: Category[];
  dbItems: Item[];
  loading: boolean;
  routeData: RouteData;
  breadcrumbs: Category[];
  contentSizeData?: DOMRectReadOnly;
};

// Default values for AppProps
const AppContext = createContext<AppProps>({
  dbCategories: [],
  dbItems: [],
  loading: true,
  routeData: { cid: null, iid: null },
  breadcrumbs: [],
});

export default AppContext;
