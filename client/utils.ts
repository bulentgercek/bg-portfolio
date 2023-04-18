import { Category, Item } from "./src/api/interfaces";
import { NavElement, RouteData } from "./src/pages";

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
 * Get Item by id
 * @param items Item[]
 * @returns Item | undefined
 */
export const getItemById = (items: Item[], id: number | null) => {
  const result = items.find((item) => item.id === id);
  return result;
};

/**
 * Sort Database Arrays
 * @param array T[]
 * @param by "name" | "id"
 * @returns T[]
 */
type Sort = {
  name: string;
  id: number;
};

export const sortDbArray = <T extends Sort>(array: T[] | null, by: "name" | "id") => {
  let result: T[] = [];

  if (array) {
    if (by === "name") {
      result = array.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (by === "id") {
      result = array.sort((a, b) => a.id - b.id);
    }
  }
  return result;
};

/**
 * Create an breadcrumbs tree array for active category
 * @param categories Category[]
 * @param currentCategory Category
 * @param rootCategory Category
 * @returns Category[]
 */
export const getBreadcrumbs = (categories: Category[], currentCategory: Category | null): Category[] => {
  const parentTree: Category[] = [];

  if (currentCategory) parentTree.push(currentCategory);

  while (currentCategory) {
    const upperLevelParent = categories.find((category) => currentCategory?.parentCategory?.id === category.id);

    // Add it to array
    if (upperLevelParent) {
      parentTree.splice(0, 0, upperLevelParent);
      currentCategory = upperLevelParent;
    } else {
      break;
    }
  }
  return parentTree;
};

/**
 * Check the object is a type of Category
 * @param object any
 * @returns boolean
 */
export const isCategory = (object: unknown): object is Category => {
  return (object as Category).parentCategory !== undefined;
};

/**
 * Check the object is a type of Category
 * @param object any
 * @returns boolean
 */
export const isItem = (object: unknown): object is Item => {
  return (object as Item).contents !== undefined;
};

/**
 * Check the navElement if it has child element
 * @param navElement NavElement
 * @returns boolean
 */
export const isThisNavElementHasChildElement = (navElement: NavElement) => {
  return navElement.childElement.length > 0;
};

/**
 * Check the selected navElement is a Category
 * @param navElement NavElement
 * @param routeData RouteData
 * @returns boolean
 */
export const isSelectedNavElementACategory = (navElement: NavElement, routeData: RouteData) => {
  return routeData && routeData.cid === navElement.element.id && routeData.iid === null;
};

/**
 * Check the selected navElement is an Item
 * @param navElement NavElement
 * @param routeData RouteData
 * @returns boolean
 */
export const isSelectedNavElementAnItem = (navElement: NavElement, routeData: RouteData) => {
  return routeData && routeData.iid === navElement.element.id;
};

/**
 * Check the breadcrumbs if it has the category
 * @param category Category
 * @param breadcrumbs Category[]
 * @returns boolean | number
 */
export const isThisCategoryInBreadcrumbs = (
  category: Category,
  breadcrumbs: Category[],
  resultType: "boolean" | "number" = "boolean",
) => {
  const index = breadcrumbs.findIndex((breadcrumb) => category && breadcrumb.id === category.id);

  const getResult = () => {
    if (resultType === "boolean") {
      return index !== -1 ? true : false;
    }
    return index;
  };

  const result = getResult();
  return result;
};
