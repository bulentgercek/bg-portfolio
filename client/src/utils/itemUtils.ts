import { Item } from "../api/interfaces";

/**
 * Get Item by id
 * @param items Item[]
 * @returns Item | undefined
 */
export const getItemById = (items: Item[], id: number | null) => {
  const result = items.find((item) => item.id === id);
  return result;
};

/**
 * Check the object is a type of Item
 * @param object any
 * @returns boolean
 */
export const isItem = (object: unknown): object is Item => {
  return (object as Item).contents !== undefined;
};
