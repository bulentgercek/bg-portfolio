import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import arrow_right from "../assets/arrow_right.svg";
import arrow_down from "../assets/arrow_down.svg";
import { NavElement, RouteData } from ".";
import { Category, Item } from "../api/interfaces";
import {
  isThisCategoryInBreadcrumbs,
  isCategory,
  isThisNavElementHasChildElement,
  isItem,
  isSelectedNavElementAnItem,
  isSelectedNavElementACategory,
} from "../../utils";

/**
 * Navigation Function Component
 */
type NavigationProps = {
  dbCategories: Category[];
  dbItems: Item[];
  loading: boolean;
  routeData: RouteData;
  breadcrumbs: Category[];
};

const Navigation: React.FC<NavigationProps> = ({ dbCategories, dbItems, loading, routeData, breadcrumbs }) => {
  const [navData, setNavData] = useState<NavElement[]>([]);

  /**
   * onChange locationPathname: createNavData
   */
  useEffect(() => {
    if (dbCategories.length === 0 && dbItems.length === 0) return;

    // console.log("breadcrumbs", JSON.stringify(breadcrumbs, null, 2));

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
      <ul className="flex flex-col gap-2.5 transition-all duration-500 ease-out">
        {/* Navigation Root Elements */}
        {navData.map((navElement) => (
          <NavigationElement
            key={navElement.element.id}
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
          className={`flex items-center justify-between font-semibold transition-all duration-500 ease-out hover:translate-x-1 hover:text-purple-600 ${
            isCategory(navElement.element) &&
            (isThisCategoryInBreadcrumbs(navElement.element, breadcrumbs, "number") as number) % 2 === 0
              ? ` rounded-2xl bg-blue-100 p-[15px] text-indigo-700`
              : isCategory(navElement.element) &&
                (isThisCategoryInBreadcrumbs(navElement.element, breadcrumbs, "number") as number) % 2 === 1
              ? ` rounded-2xl bg-blue-200 p-[15px] text-indigo-900`
              : ` text-indigo-500`
          } ${
            isSelectedNavElementACategory(navElement, routeData) &&
            `text-purple-500 ${routeData.cid} ${navElement.element.id}`
          } ${
            isSelectedNavElementAnItem(navElement, routeData) &&
            `text-purple-500 ${routeData.iid} ${navElement.element.id}`
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
      <div
        className={`transition-all duration-500 ease-out ${
          isSelectedNavElementACategory(navElement, routeData) &&
          isThisNavElementHasChildElement(navElement) &&
          `rounded-2xl bg-indigo-100/50 p-[5px] ${navElement.element.name}`
        }`}
      >
        <ul className={`flex flex-col gap-2.5 pl-2.5 transition-all duration-500 ease-out`}>
          {navElement.childElement.map((child) => (
            <NavigationElement
              key={`${child.element.id}`}
              navElement={child}
              routeData={routeData}
              breadcrumbs={breadcrumbs}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navigation;
