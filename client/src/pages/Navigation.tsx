import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import arrow_right from "../assets/arrow_right.svg";
import arrow_down from "../assets/arrow_down.svg";
import { NavElement, RouteData } from ".";
import { Category, Item } from "../api/interfaces";
import {
  isThisCategoryInBreadcrumbs,
  isCategory,
  isThisNavElementHasChildElement,
  isSelectedNavElementAnItem,
  isSelectedNavElementACategory,
  createKey,
} from "../../utils";
import AppContext from "../AppContext";

/**
 * Navigation Function Component
 */
const Navigation: React.FC = () => {
  const [navData, setNavData] = useState<NavElement[]>([]);

  // Calling Context Values
  const context = useContext(AppContext);
  const { dbCategories, dbItems, loading, routeData, breadcrumbs } = context;

  /**
   * onChange routeData, dbCategories, dbItems
   */
  useEffect(() => {
    if (dbCategories.length === 0 && dbItems.length === 0) return;

    const createNavData = (dbCategories: Category[], dbItems: Item[]): NavElement[] => {
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

    const createdNavData = createNavData(dbCategories, dbItems);
    setNavData(createdNavData);
  }, [routeData, dbCategories, dbItems]);

  return (
    <div id="Navigation">
      <ul className={`flex flex-col gap-2.5 text-indigo-700 transition-all duration-500 ease-out`}>
        {/* Navigation Root Elements */}
        {navData.map((navElement) => (
          <NavigationElement
            key={createKey(navElement)}
            navElement={navElement}
            routeData={routeData}
            breadcrumbs={breadcrumbs}
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
  breadcrumbs: Category[];
};

const NavigationElement: React.FC<NavigationElementProps> = ({ navElement, routeData, breadcrumbs }) => {
  return (
    <>
      {/* Navigation Elements */}
      <Link to={navElement.route}>
        <li
          className={`flex items-center justify-between font-semibold transition-all duration-500 ease-out hover:translate-x-1 ${
            isCategory(navElement.element) &&
            (isThisCategoryInBreadcrumbs(navElement.element, breadcrumbs, "number") as number) % 2 === 0
              ? `rounded-2xl bg-blue-100 p-4 text-indigo-700`
              : isCategory(navElement.element) &&
                (isThisCategoryInBreadcrumbs(navElement.element, breadcrumbs, "number") as number) % 2 === 1
              ? `rounded-2xl bg-blue-200 p-4 text-indigo-900`
              : ``
          } 
          ${
            isSelectedNavElementACategory(navElement, routeData) && isCategory(navElement.element)
              ? `text-indigo-900 ${routeData.cid} ${navElement.element.id}`
              : ``
          } ${
            isSelectedNavElementAnItem(navElement, routeData) && !isCategory(navElement.element)
              ? `rounded-2xl bg-gradient-to-r from-blue-200/30 p-2.5 pl-4 text-blue-600`
              : ``
          }`}
        >
          {navElement.element.name}
          {isCategory(navElement.element) &&
            (isThisCategoryInBreadcrumbs(navElement.element, breadcrumbs) ? (
              <img src={arrow_down} alt="arrow_down" className="mr-2" />
            ) : (
              <img src={arrow_right} alt="arrow_right" className="mr-2" />
            ))}
        </li>
      </Link>

      {/* Navigation Child Elements */}
      {navElement.childElement.length > 0 && (
        <div
          className={`transition-all duration-500 ease-out ${
            isSelectedNavElementACategory(navElement, routeData) && isThisNavElementHasChildElement(navElement)
              ? `ml-4 rounded-2xl bg-indigo-100 p-3 pl-1 ${navElement.element.name}`
              : ``
          }`}
        >
          <ul className={`flex flex-col gap-2.5 pl-4 transition-all duration-500 ease-out `}>
            {navElement.childElement.map((child) => (
              <NavigationElement
                key={createKey(child)}
                navElement={child}
                routeData={routeData}
                breadcrumbs={breadcrumbs}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navigation;
