import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import arrow_right from "../assets/arrow_right.svg";
import arrow_down from "../assets/arrow_down.svg";
import { NavElement, RouteData } from ".";
import { Category } from "../api/interfaces";
import AppContext from "../AppContext";
import Spinner from "../components/Spinner";
import {
  createKey,
  createNavData,
  isItemSelected,
  isSelectedNavElementACategory,
  isSelectedNavElementAnItem,
  isThisCategoryInBreadcrumbs,
  isThisNavElementHasChildElement,
} from "../utils/navigationUtils";
import { isCategory } from "../utils/categoryUtils";
import { isItem } from "../utils/itemUtils";

/**
 * Navigation Function Component
 */
const Navigation: React.FC = () => {
  // Calling Context Values
  const context = useContext(AppContext);
  const { dbCategories, dbItems, routeData, breadcrumbs, navData, setNavData } = context;

  /**
   * onChange routeData, dbCategories, dbItems
   */
  useEffect(() => {
    if (!dbCategories || !dbItems) return;
    const createdNavData = createNavData(dbCategories, dbItems, breadcrumbs);
    setNavData(createdNavData);
  }, [routeData, dbCategories, dbItems]);

  return (
    <div id="Navigation">
      <ul className={`flex flex-col gap-2.5 text-indigo-700 transition-all duration-500 ease-out`}>
        {/* Navigation Root Elements */}
        {navData?.map((navElement) => (
          <NavigationElement
            key={createKey(navElement)}
            navElement={navElement}
            routeData={routeData}
            breadcrumbs={breadcrumbs}
          />
        )) ?? <Spinner />}
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
          className={`flex items-center justify-between font-semibold
          ${
            isCategory(navElement.element) &&
            (isThisCategoryInBreadcrumbs(navElement.element, breadcrumbs, "number") as number) % 2 === 0
              ? `trans-d500 rounded-2xl bg-blue-100 p-4 text-indigo-700 hover:pl-6`
              : isCategory(navElement.element) &&
                (isThisCategoryInBreadcrumbs(navElement.element, breadcrumbs, "number") as number) % 2 === 1
              ? `trans-d500 rounded-2xl bg-blue-200 p-4 text-indigo-900 hover:pl-6`
              : `trans-d500 hover:pl-2`
          } 
          ${
            isSelectedNavElementACategory(navElement, routeData)
              ? `text-indigo-900 ${routeData.cid} ${navElement.element.id}`
              : ``
          } ${
            isSelectedNavElementAnItem(navElement, routeData) && !isCategory(navElement.element)
              ? `trans-d500 rounded-2xl bg-gradient-to-r from-blue-200/30 p-2.5 pl-4 text-blue-600 hover:pl-6`
              : ``
          }
          ${
            isItem(navElement.element) &&
            !isItemSelected(navElement.element, routeData) &&
            `trans-d500 text-indigo-900 hover:pl-2`
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
