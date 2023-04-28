import { Category, Item } from "../api/interfaces";

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
 * Check the object is a type of Category
 * @param object any
 * @returns boolean
 */
export const isCategory = (object: unknown): object is Category => {
  return (object as Category).parentCategory !== undefined;
};
