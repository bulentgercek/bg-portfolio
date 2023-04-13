/**
 * Navigation Functions
 */

import { Category } from "../api/interfaces";

/**
 * Get Category by name
 * @param categories Category[]
 * @returns Category | undefined
 */
export const getCategoryByName = (categories: Category[], name: string) => {
  const result = categories.find((category) => category.name === name);
  return result;
};

/**
 * Get Category by id
 * @param categories Category[]
 * @returns Category | undefined
 */
export const getCategoryById = (categories: Category[], id: number | null) => {
  const result = categories.find((category) => category.id === id);
  return result;
};

/**
 * Sort Categories
 * @param categories Category[]
 * @param by "name" | "id"
 * @returns Category[]
 */
export const sortCategories = (categories: Category[], by: "name" | "id") => {
  let result: Category[] = [];

  if (by === "name") {
    result = categories.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (by === "id") {
    result = categories.sort((a, b) => a.id - b.id);
  }

  return result;
};
