import { Category, Item } from "../api/interfaces";

/**
 * Consts
 */
export const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Layout
 * Interfaces, Types
 */
export type States = {
  sidebarWidth: string;
  logoAreaWidth: string;
  navListSwitch: string;
  sidebarGap: string;
  backgroundFill?: string;
  contentAreaWidth: string;
};

export type StatesData = {
  sidebarWidth: {
    w0: string;
    wSidebar: string;
  };
  logoAreaWidth: {
    open: string;
    close: string;
  };
  navListSwitch: {
    close: string;
    open: string;
  };
  sidebarGap: {
    gap20px: string;
    gap0px: string;
  };
  backgroundFill: {
    bgColorOpacity25: string;
    bgColorOpacity0: string;
  };
  contentAreaWidth: {
    wPercentMinusSidebar: string;
    wFull: string;
  };
};

/**
 * Navigation
 * Interfaces, Types
 */
export type RouteData = {
  cid: number | null;
  iid: number | null;
};

export type NavElement = {
  element: Category | Item;
  route: string;
  childElement: NavElement[];
};
