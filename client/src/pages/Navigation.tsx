import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import arrow_right from "../assets/arrow_right.svg";
import arrow_down from "../assets/arrow_down.svg";
import { NavElement, RouteData } from ".";
import { Category, Item } from "../api/interfaces";
import {
  getCategoryById,
  getBreadcrumbs,
  isThisElementACategory,
  isThisCategoryElementSelected,
  isThisElementHasChildElement,
} from "../../utils";

/**
 * Navigation Function Component
 */
type NavigationProps = {
  dbCategories: Category[];
  dbItems: Item[];
  loading: boolean;
  routeData: RouteData;
};

const Navigation: React.FC<NavigationProps> = ({ dbCategories, dbItems, loading, routeData }) => {
  const [navData, setNavData] = useState<NavElement[]>([]);

  /**
   * onChange locationPathname: createNavData
   */
  useEffect(() => {
    if (dbCategories.length === 0 && dbItems.length === 0) return;

    // console.log("Console cleared by: ", Navigation.name);
    // console.log("onMount: dbCategories:", dbCategories);
    // console.log("onMount: dbItems:", dbItems);
    // console.log("routeData: ", routeData);

    const activeCategory = getCategoryById(dbCategories, routeData.cid) || null;

    // console.log("activeCategory: ", activeCategory);
    // console.log("activeItem: ", getItemById(dbItems, routeData.iid) || null);

    const breadcrumbs = getBreadcrumbs(dbCategories, activeCategory);

    // console.log("activeCategoryParentTree:", JSON.stringify(breadcrumbs, null, 2));

    const createNavData = (
      dbCategories: Category[],
      dbItems: Item[],
      breadcrumbs: Category[],
    ): NavElement[] => {
      const tNavData: NavElement[] = [];

      const inBreadcrumbs = (categoryChecked: Category) => {
        const categoryFoundInBreadcrumbs = breadcrumbs.find((c) => c.id === categoryChecked.id);
        return categoryFoundInBreadcrumbs;
      };

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

        // console.log("Recursive - parentCElement: ", parentCElement.element.name, childCategories);
        // Add child categories to Parent's childElement array
        for (const childCategory of childCategories) {
          const navChildCategory: NavElement = {
            element: childCategory,
            route: `/category/${childCategory.id}`,
            childElement: [],
          };
          parentCategoryElement.childElement.push(navChildCategory);

          // if
          if (!inBreadcrumbs(childCategory)) continue;

          // Add child items to Parent's childElement array
          const childItems = childCategory.items || [];
          for (const item of childItems) {
            navChildCategory.childElement.push({
              element: item,
              route: `/category/${navChildCategory.element.id}/item/${item.id}`,
              childElement: [],
            });
          }

          addChildElements(navChildCategory);
        }
      };

      // Add child elements to Root elements
      for (const tNavRootElement of tNavData) {
        if (
          isThisElementACategory(tNavRootElement) &&
          inBreadcrumbs(tNavRootElement.element as Category)
        )
          addChildElements(tNavRootElement);
      }

      // Final
      return tNavData;
    };

    const createdNavData = createNavData(dbCategories, dbItems, breadcrumbs);
    setNavData(createdNavData);
  }, [routeData, dbCategories, dbItems]);

  return (
    <div>
      <ul className="flex flex-col gap-2.5">
        {/* Navigation Root Elements */}
        {navData.map((navElement) => (
          <NavigationElement
            key={navElement.element.id}
            navElement={navElement}
            routeData={routeData}
          />
        ))}
      </ul>
    </div>
  );
};

/**
 * Navigation Element Function Component
 */
type NavigationElementProps = {
  navElement: NavElement;
  routeData: RouteData;
};

const NavigationElement: React.FC<NavigationElementProps> = ({ navElement, routeData }) => {
  return (
    <>
      {/* Navigation Elements */}
      <Link to={navElement.route}>
        <li className={`flex items-center justify-between font-semibold text-indigo-500`}>
          {navElement.element.name}
          {isThisElementACategory(navElement) &&
            /**
             *  ->>> Needed Feature : isCategoryInBreadcrumbs? then arrow_down
             */
            (isThisCategoryElementSelected(navElement, routeData) ? (
              <img src={arrow_down} alt="arrow_down" className="mr-2" />
            ) : (
              <img src={arrow_right} alt="arrow_right" className="mr-2" />
            ))}
        </li>
      </Link>
      {/* Navigation Child Elements */}
      {isThisElementHasChildElement(navElement) && (
        <ul className="flex flex-col gap-2.5 pl-2.5">
          {navElement.childElement.map((child) => (
            <NavigationElement key={child.element.id} navElement={child} routeData={routeData} />
          ))}
        </ul>
      )}
    </>
  );
};

export default Navigation;

// const isItem = (route: string) => route.includes("item");

// const getItemClass = (route: string, routeData: RouteData) => {
//   const routeParts = route.split("/");
//   const cid = routeParts.includes("category")
//     ? parseInt(routeParts[routeParts.indexOf("category") + 1], 10)
//     : null;
//   const iid = routeParts.includes("item")
//     ? parseInt(routeParts[routeParts.indexOf("item") + 1], 10)
//     : null;

//   if (routeData.cid === cid && routeData.iid === iid) {
//     return "text-yellow-500";
//   } else {
//     return isItem(route) ? "text-green-500" : "text-blue-500";
//   }
// };

// return (
//   <div>
//     {loading ? (
//       <p>Loading Navigation Data...</p>
//     ) : (
//       <ul className="text-gray-700">
//         {navData.map((navElement: NavElement) => {
//           const renderNav = (items: NavElement[]) => {
//             return items.map((item) => (
//               <li key={item.element.id} className="my-2">
//                 <Link
//                   to={item.route}
//                   className={`text-lg font-semibold hover:text-blue-500 ${getItemClass(
//                     item.route,
//                     routeData,
//                   )}`}
//                 >
//                   {item.element.name}
//                   {!isItem(item.route) && item.childElement.length === 0 && (
//                     <span className="ml-2">{"+"}</span>
//                   )}
//                   {!isItem(item.route) && item.childElement.length > 0 && (
//                     <span className="ml-2">{"-"}</span>
//                   )}
//                 </Link>
//                 {item.childElement.length > 0 && (
//                   <ul className="ml-4">{renderNav(item.childElement)}</ul>
//                 )}
//               </li>
//             ));
//           };
//           return renderNav([navElement]);
//         })}
//       </ul>
//     )}
//   </div>
// );
