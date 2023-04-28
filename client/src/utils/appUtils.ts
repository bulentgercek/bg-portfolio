import { Category } from "../api/interfaces";

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
 * Get Custom CSS Variables
 * Author: ChatGPT 4.0
 * @param startingString string
 * @returns object CSSVar
 */

type CSSVar = { [key: string]: number };

export const getCustomCSSVariables = (startingString: string): CSSVar => {
  const cssVars: CSSVar = {};

  for (const styleSheet of Array.from(document.styleSheets)) {
    const cssRules = (styleSheet as CSSStyleSheet).cssRules;

    for (const cssRule of Array.from(cssRules)) {
      if (cssRule instanceof CSSStyleRule) {
        const styleRule = cssRule as CSSStyleRule;

        if (styleRule.selectorText === ":root") {
          for (const propertyName of Array.from(styleRule.style)) {
            if (propertyName.startsWith(startingString)) {
              const value = styleRule.style.getPropertyValue(propertyName).trim().split("px")[0];
              cssVars[propertyName] = parseInt(value, 10);
              // Alternatively, you can use the unary + operator:
              // cssVars[propertyName] = +value;
            }
          }
        }
      }
    }
  }

  return cssVars;
};
