import { Category } from "./src/api/interfaces";

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
 * Create an parent tree array for active category
 * @param categories Category[]
 * @param currentCategory Category
 * @param rootCategory Category
 * @returns Category[]
 */
export const getCategoryParentTree = (
  categories: Category[],
  currentCategory: Category,
  rootCategory: Category,
): Category[] => {
  const parentTree: Category[] = [];

  if (currentCategory.name !== "Root") {
    parentTree.push(currentCategory);

    // Loop until the parent reaches to Root add it to array of NavListElementType
    while (parentTree[parentTree.length - 1].id !== rootCategory?.id) {
      const upperLevelParent = categories.find(
        (category) => currentCategory?.parentCategory?.id === category.id,
      );

      // Add it to array
      if (upperLevelParent) {
        parentTree.splice(0, 0, upperLevelParent);
        currentCategory = upperLevelParent;
      } else {
        break;
      }
    }
  }
  return parentTree;
};

// function createNavData(
//   categories: Category[],
//   items: Item[],
//   location: Location,
//   activeCategoryParentTree: Category[],
// ): NavElement[] {
//   const navData: NavElement[] = [];

//   for (const category of categories) {
//     if (!category.parent) {
//       const navCategory: NavData = {
//         element: category,
//         route: `/category/${category.id}`,
//         childElement: [],
//       };
//       const subcategories = categories.filter((c) => c.parent && c.parent.id === category.id);
//       for (const subcategory of subcategories) {
//         const navSubcategory: NavData = {
//           element: subcategory,
//           route: `/category/${subcategory.id}`,
//           childElement: [],
//         };
//         if (subcategory.id === activeCategoryParentTree[0].id) {
//           const childItems = items.filter((i) => i.category.id === subcategory.id);
//           for (const item of childItems) {
//             navSubcategory.childElement.push({
//               element: item,
//               route: `/category/${subcategory.id}/item/${item.id}`,
//               childElement: [],
//             });
//           }
//         }
//         navCategory.childElement.push(navSubcategory);
//       }
//       navData.push(navCategory);
//     }
//   }

//   // Recursive function to add child elements to their parent's childElement array
//   function addChildren(parent: NavData) {
//     const childCategories = categories.filter((c) => c.parent && c.parent.id === parent.element.id);
//     for (const childCategory of childCategories) {
//       const navChildCategory: NavData = {
//         element: childCategory,
//         route: `/category/${childCategory.id}`,
//         childElement: [],
//       };
//       if (childCategory.id === activeCategoryParentTree[0].id) {
//         const childItems = items.filter((i) => i.category.id === childCategory.id);
//         for (const item of childItems) {
//           navChildCategory.childElement.push({
//             element: item,
//             route: `/category/${childCategory.id}/item/${item.id}`,
//             childElement: [],
//           });
//         }
//       }
//       parent.childElement.push(navChildCategory);
//       addChildren(navChildCategory);
//     }
//   }

//   // Add child elements to their parent's childElement array recursively
//   for (const navCategory of navData) {
//     addChildren(navCategory);
//   }

//   return navData;
// }

// /**
//  * OLD ONE
//  */

// /**
//  * Create NavData
//  * @param activeCategoryParentTree Category[]
//  * @returns NavElement[]
//  */
// const createNavData2 = (activeCategoryParentTree: Category[]): NavElement[] => {
//   let tempNavData: NavElement[] = [];

//   for (const treeCategory of activeCategoryParentTree) {
//     console.log("Active:", treeCategory.name, treeCategory.id);

//     // Check if active treeCategory already added to tempNavData.element
//     // If so, get its index otherwise -1
//     const prevCategoryIndex = (() => {
//       let tempIndex;

//       tempIndex = findElementIndex(tempNavData, treeCategory.id);
//       return tempIndex;
//     })();

//     console.log("prevCategoryIndex:", prevCategoryIndex);

//     // has childCategories?
//     if (treeCategory.childCategories) {
//       console.log("childCategories: ", treeCategory.childCategories);

//       for (const childCategory of treeCategory.childCategories) {
//         console.log("Current childCategory: ", childCategory.name);
//         // console.log("For Loop Starts / tempNavData: ", [...tempNavData]);

//         const element: NavElement = {
//           element: childCategory,
//           route: `/category/${childCategory.id}`,
//           childElement: [],
//         };

//         if (prevCategoryIndex !== -1) {
//           tempNavData = [
//             ...tempNavData.slice(0, prevCategoryIndex),
//             {
//               ...tempNavData[prevCategoryIndex],
//               childElement: [...tempNavData[prevCategoryIndex].childElement, element],
//             },
//             ...tempNavData.slice(prevCategoryIndex + 1),
//           ];
//           console.log("Sliced -> childElement: ", element);
//         } else {
//           tempNavData = [...tempNavData, { ...element }];
//           console.log("Pushed: ", element);
//         }
//         console.log("Current tempNavData: ", JSON.stringify([...tempNavData], null, 2));
//       }
//     }
//     // Add items
//     if (treeCategory.items) {
//       for (const item of treeCategory.items) {
//         console.log("Current item: ", item.name);
//         // console.log("For Loop Starts / tempNavData: ", [...tempNavData]);
//         const element: NavElement = {
//           element: item,
//           route: `/category/${treeCategory.id}/item/${item.id}`,
//           childElement: [],
//         };

//         if (prevCategoryIndex !== -1) {
//           tempNavData = [
//             ...tempNavData.slice(0, prevCategoryIndex),
//             {
//               ...tempNavData[prevCategoryIndex],
//               childElement: [...tempNavData[prevCategoryIndex].childElement, element],
//             },
//             ...tempNavData.slice(prevCategoryIndex + 1),
//           ];
//           console.log("Sliced Item -> childElement: ", element);
//         } else {
//           tempNavData = [...tempNavData, { ...element }];
//           console.log("Pushed Item: ", element);
//         }
//         console.log("Current tempNavData: ", [...tempNavData]);
//       }
//     }
//   }
//   console.log("Final tempNavData: ", JSON.stringify([...tempNavData], null, 2));
//   return tempNavData;
// };
