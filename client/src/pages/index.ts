import { Category } from "../api/interfaces";

/**
 * Consts
 */
export const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Layout
 * Interfaces, Types
 */
export type LayoutProps = {
  type: string;
  id: string;
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
  category: Category;
  route: string;
};

export type RouteDataType = {
  cid: number | null;
  iid: number | null;
};
