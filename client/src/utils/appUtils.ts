import { v4 as uuid } from "uuid";

import { Category, Item } from "../api/interfaces";

/**
 * Create a breadcrumbs tree array for the active category
 * @param categories Category[]
 * @param currentCategory Category
 * @returns Category[]
 */
export const getBreadcrumbs = (categories: Category[], currentCategory: Category | null): Category[] => {
  // Initialize an empty array to store the parent tree
  const parentTree: Category[] = [];

  // If the currentCategory exists, add it to the parentTree array
  if (currentCategory) parentTree.push(currentCategory);

  // Loop until there are no more parent categories
  while (currentCategory) {
    // Find the upper level parent category in the categories array
    const upperLevelParent = categories.find((category) => currentCategory?.parentCategory?.id === category.id);

    // If an upper level parent is found, add it to the beginning of the parentTree array
    if (upperLevelParent) {
      parentTree.splice(0, 0, upperLevelParent);
      // Set the currentCategory to the found upper level parent for the next iteration
      currentCategory = upperLevelParent;
    } else {
      // If no upper level parent is found, break the loop
      break;
    }
  }
  // Return the parentTree array containing the breadcrumbs for the active category
  return parentTree;
};

/**
 * Returns a uuidv4 string
 * @returns uuid string
 */
export const createKey = (): string => {
  return uuid();
};

/**
 * Create a total items array of all the child categories of a category
 * @param dbCategories Category[]
 * @returns Item[]
 */
export const createCategoryItemList = (dbCategories: Category[], categoryId: number): Item[] => {
  // Find the selected category using the provided categoryId
  const selectedCategory = dbCategories.find((category) => category.id === categoryId);
  // Initialize an empty array to store items
  let items: Item[] = [];

  // A recursive function to add items of the current category and its child categories
  const addChildItems = (activeCategory: Category) => {
    // Find the current category in the dbCategories array
    const currentCategory = dbCategories.find((category) => category.id === activeCategory.id);

    // If the current category has items, add them to the items array
    if (currentCategory && currentCategory.items && currentCategory.items.length > 0) {
      // Use Array.prototype.push.apply method to add items from one array to another
      items.push.apply(items, currentCategory.items);
    }

    // If the current category does not have child categories, return (stop recursion)
    if (!currentCategory || !currentCategory.childCategories) return;

    // Iterate through the child categories and call the addChildItems function recursively
    for (const childCategory of currentCategory.childCategories) {
      addChildItems(childCategory);
    }
  };

  // Start the recursion with the selectedCategory
  if (selectedCategory) addChildItems(selectedCategory);
  // Return the items array containing items from the selectedCategory and its child categories
  return items;
};
