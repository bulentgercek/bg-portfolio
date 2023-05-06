import { Category, Item } from "../api/interfaces";
import { NavElement, RouteData } from "../pages";
import { isCategory } from "./categoryUtils";
import { isItem } from "./itemUtils";
import { v4 as uuid } from "uuid";

/**
 * Get the sum of dbCategories and dbItems that has no parent category
 * @param dbCategories Category[]
 * @param dbItems Item[]
 * @returns number
 */
export const getRootElementCount = (dbCategories: Category[], dbItems: Item[]): number => {
  const rootCategoriesCount = dbCategories.filter((category) => category.parentCategory === null).length;
  const rootItemsCount = dbItems.filter((item) => item.categories && item.categories.length === 0).length;
  return rootCategoriesCount + rootItemsCount;
};

/**
 * Check if the obj is NavElement by looking it's properties
 * @param obj Unknown
 * @returns obj is NavElement
 */
export const isNavElement = (obj: unknown): obj is NavElement => {
  if (typeof obj !== "object" || obj === null) return false;

  const navElementObj = obj as NavElement;
  const hasRoute = "route" in navElementObj && typeof navElementObj.route === "string";
  return hasRoute;
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
  return routeData && routeData.iid !== null && routeData.iid === navElement.element.id;
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

/**
 * Check the item selected or not
 * @param item Item
 * @param routeData RouteData
 * @returns boolean
 */
export const isItemSelected = (item: Item, routeData: RouteData) => {
  if (!isItem(item)) return false;
  return item.id === routeData.iid;
};

/**
 * Creating a unique key using the element id's
 * @param navElement or unknown
 * @returns string
 */
export const createNavElementKey = (reference: NavElement): string => {
  const keyData = { cid: 0, iid: 0 };
  isCategory(reference.element) ? (keyData.cid = reference.element.id) : (keyData.iid = reference.element.id);

  return `c${keyData.cid}_i${keyData.iid}`;
};

/**
 * Creates Navigation Data
 * @param dbCategories Category[]
 * @param dbItems Item[]
 * @param breadcrumbs Category[]
 * @returns NavElement[]
 */
export const createNavData = (dbCategories: Category[], dbItems: Item[], breadcrumbs: Category[]): NavElement[] => {
  const tNavData: NavElement[] = [];

  // Add Root Categories
  for (const dbCategory of dbCategories) {
    if (dbCategory.parentCategory) continue;
    tNavData.push({
      element: dbCategory,
      route: `/category/${dbCategory.id}`,
      childElement: [],
    });
  }

  // Add Root Items
  for (const dbItem of dbItems) {
    if (dbItem.categories && dbItem.categories.length > 0) continue;
    tNavData.push({
      element: dbItem,
      route: `/item/${dbItem.id}`,
      childElement: [],
    });
  }

  // Recursive Function: Add child elements to Parent Root Element
  const addChildElements = (parentCategoryElement: NavElement) => {
    const childCategories = dbCategories.filter(
      (c) => c.parentCategory && c.parentCategory.id === parentCategoryElement.element.id,
    );

    // Add child categories to Parent's childElement array
    for (const childCategory of childCategories) {
      const navChildCategory: NavElement = {
        element: childCategory,
        route: `/category/${childCategory.id}`,
        childElement: [],
      };
      parentCategoryElement.childElement.push(navChildCategory);

      if (!isThisCategoryInBreadcrumbs(childCategory, breadcrumbs) as boolean) continue;

      addChildElements(navChildCategory);
    }

    // Add child items to Parent's childElement array
    if (isCategory(parentCategoryElement.element)) {
      const childItems = parentCategoryElement.element.items ?? [];
      for (const item of childItems) {
        const navChildElement: NavElement = {
          element: item,
          route: `/category/${parentCategoryElement.element.id}/item/${item.id}`,
          childElement: [],
        };
        parentCategoryElement.childElement.push(navChildElement);
      }
    }
  };

  // Add child elements to Root elements
  for (const tNavRootElement of tNavData) {
    if (
      isCategory(tNavRootElement.element) &&
      (isThisCategoryInBreadcrumbs(tNavRootElement.element, breadcrumbs) as boolean)
    )
      addChildElements(tNavRootElement);
  }

  // Final
  return tNavData;
};

/**
 * Checking if NavData currently filled or not
 * @param navData NavElement[]
 * @param breadcrumbs Category[]
 * @returns boolean
 */
export const isNavDataFilled = (navData: NavElement[], breadcrumbs: Category[], rootElementCount: number): boolean => {
  let isDeep: boolean = false;
  let isFilled: boolean = false;
  if (rootElementCount === 0) return true;

  const checkChildElements = (parentElement: NavElement) => {
    if (parentElement.childElement.length === 0) isDeep = true;
    parentElement.childElement.forEach((childElement) => {
      checkChildElements(childElement);
      if (childElement.element.id === breadcrumbs[breadcrumbs.length - 1].id) {
        isDeep = true;
      }
    });
  };

  navData.forEach((rootElement: NavElement, index) => {
    checkChildElements(rootElement);
    if (rootElementCount === index + 1) isFilled = true;
  });

  if (isFilled && isDeep) return true;
  return false;
};
