import { Category, Item } from "../api/interfaces";

/**
 * Consts
 */
export const BASE_URL = import.meta.env.VITE_BASE_URL;

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
