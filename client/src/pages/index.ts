/**
 * Consts
 */
export const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Layout
 * Interfaces, Types
 */
export type LayoutProps = {
  value: string;
};

export type StatesType = {
  sidebarWidth: string;
  logoAreaWidth: string;
  navListSwitch: string;
  sidebarGap: string;
  sidebarVisibilty?: string;
  backgroundFill?: string;
};

export type StatesDataType = {
  sidebarWidth: {
    w0px: string;
    w325px: string;
  };
  logoAreaWidth: {
    w285px: string;
    w124px: string;
  };
  navListSwitch: {
    close: string;
    open: string;
  };
  sidebarGap: {
    gap20px: string;
    gap0px: string;
  };
  sidebarVisibilty: {
    flex: string;
    hidden: string;
  };
  backgroundFill: {
    bgColorOpacity25: string;
    bgColorOpacity0: string;
  };
};

/**
 * Navigation
 * Interfaces, Types
 */
export type NavListElementType = {
  id: number;
  name: string;
  route: string;
  parentCategory?: number | null;
  class: NavListItemClass;
};

export enum NavListItemClass {
  About = "about",
  Works = "works",
  Category = "category",
  Item = "item",
}

export type RouteDataType = {
  rootRoute: string;
  categoryId: string | null;
  itemId: string | null;
};
