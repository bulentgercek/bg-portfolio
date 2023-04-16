import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { NavElement, RouteData } from ".";
import { Api } from "../api";
import { Category, Item } from "../api/interfaces";
import { getCategoryById, getBreadcrumbs, isCategory } from "../../utils";

/**
 * Navigation Function Component
 */
const Navigation: React.FC = () => {
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [dbItems, setDbItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [navData, setNavData] = useState<NavElement[]>([]);

  /**
   * onMount: Fetch dbCategories
   */
  useEffect(() => {
    const fetchData = async () => {
      const fetchCategories = await Api.getCategories();
      setDbCategories(fetchCategories);

      const fetchItems = await Api.getItems();
      setDbItems(fetchItems);

      // Delay for to see loading longer
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  /**
   * onRender: Set route variables
   */
  const { cid = null, iid = null } = useParams();
  const locationPathname = useLocation().pathname;

  const routeData: RouteData = {
    cid: cid !== null ? parseInt(cid, 10) : null,
    iid: iid !== null ? parseInt(iid, 10) : null,
  };

  /**
   * onChange locationPathname: createNavData
   */
  useEffect(() => {
    if (dbCategories.length === 0 && dbItems.length === 0) return;

    // console.clear();
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
        const categoryFoundOnParentTree = breadcrumbs.find((c) => c.id === categoryChecked.id);
        return categoryFoundOnParentTree;
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
          isCategory(tNavRootElement.element) &&
          inBreadcrumbs(tNavRootElement.element as Category)
        )
          addChildElements(tNavRootElement);
      }

      // Final
      return tNavData;
    };

    const createdNavData = createNavData(dbCategories, dbItems, breadcrumbs);
    setNavData(createdNavData);
  }, [locationPathname, dbCategories, dbItems]);

  /**
   * JSX Variables
   */
  const isItem = (route: string) => route.includes("item");

  const getItemClass = (route: string, routeData: RouteData) => {
    const routeParts = route.split("/");
    const cid = routeParts.includes("category")
      ? parseInt(routeParts[routeParts.indexOf("category") + 1], 10)
      : null;
    const iid = routeParts.includes("item")
      ? parseInt(routeParts[routeParts.indexOf("item") + 1], 10)
      : null;

    if (routeData.cid === cid && routeData.iid === iid) {
      return "text-yellow-500";
    } else {
      return isItem(route) ? "text-green-500" : "text-blue-500";
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading Navigation Data...</p>
      ) : (
        <ul className="text-gray-700">
          {navData.map((navElement: NavElement) => {
            const renderNav = (items: NavElement[]) => {
              return items.map((item) => (
                <li key={item.element.id} className="my-2">
                  <Link
                    to={item.route}
                    className={`text-lg font-semibold hover:text-blue-500 ${getItemClass(
                      item.route,
                      routeData,
                    )}`}
                  >
                    {item.element.name}
                    {!isItem(item.route) && item.childElement.length === 0 && (
                      <span className="ml-2">{"+"}</span>
                    )}
                    {!isItem(item.route) && item.childElement.length > 0 && (
                      <span className="ml-2">{"-"}</span>
                    )}
                  </Link>
                  {item.childElement.length > 0 && (
                    <ul className="ml-4">{renderNav(item.childElement)}</ul>
                  )}
                </li>
              ));
            };
            return renderNav([navElement]);
          })}
        </ul>
      )}
    </div>
  );
};

export default Navigation;
