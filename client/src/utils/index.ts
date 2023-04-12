import { NavListElementType, NavListItemClass } from "../pages";

/**
 * Navigation Functions
 */
/**
 * Get Element object result with a key parameter from NavListElementType[]
 * @param navData
 * @param property
 * @param value
 * @returns NavListElementType
 */
export const getNavlistElement = (
  navData: NavListElementType[],
  property: keyof NavListElementType,
  value: number,
) => {
  return navData.find((item) => item[property] === value);
};

/**
 * Get Element array result with a key parameter from NavListElementType[]
 * @param navData
 * @param property
 * @param value
 * @returns NavListElementType[]
 */
export const getNavlistElements = (
  navData: NavListElementType[],
  property: keyof NavListElementType,
  value: number,
) => {
  return navData.filter((item) => item[property] === value);
};

/**
 * Create unique keys for navigation list elements
 * @param navListElement
 * @returns
 */
export const createKey = (navListElement: NavListElementType): string => {
  let key: string = "";

  switch (navListElement.class) {
    case NavListItemClass.About:
      key = `a${navListElement.id}`;
      break;
    case NavListItemClass.Works:
      key = `w${navListElement.id}`;
      break;
    case NavListItemClass.Category:
      key = `c${navListElement.id}`;
      break;
    case NavListItemClass.Item:
      key = `i${navListElement.id}`;
      break;
  }

  return key;
};
