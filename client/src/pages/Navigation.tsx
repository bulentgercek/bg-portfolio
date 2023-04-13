import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { BASE_URL, NavListElementType, RouteDataType } from ".";
import { Api } from "../api";
import { Category } from "../api/interfaces";
import { getCategoryById, getCategoryByName, sortCategories } from "../utils";

/**
 * Navigation Function Component
 */
const Navigation: React.FC = () => {
  const [dbcategories, setDbCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [routeData, setRouteData] = useState<RouteDataType>();
  const [navData, setNavData] = useState<NavListElementType[]>([]);

  // onMount: Fetch dbCategories
  useEffect(() => {
    const fetchData = async () => {
      const fetchResult = await Api.getCategories();
      setDbCategories(fetchResult);

      // Delay for to see loading longer
      setTimeout(() => {
        setLoading(false);
      }, 1000);

      console.clear();
      console.log("onMount: dbCategories set.");
    };
    fetchData();
  }, []);

  // onRender: Set Route Variables
  const { cid = null, iid = null } = useParams();
  const locationPathname = useLocation().pathname;

  // onChange locationPathname: Update routeData
  useEffect(() => {
    if (dbcategories.length === 0) return;

    const newRouteData: RouteDataType = {
      cid: cid !== null ? parseInt(cid, 10) : null,
      iid: iid !== null ? parseInt(iid, 10) : null,
    };
    setRouteData(newRouteData);
    console.log("onChanges locationPathname : routeData set.");
  }, [locationPathname, dbcategories]);

  // onChange routeData: Update navData
  useEffect(() => {
    if (routeData === undefined) return;
    console.log("routeData: ", routeData);

    // Constants
    const rootCategory = getCategoryByName(dbcategories, "Root");
    const dbCategoriesSorted = sortCategories(dbcategories, "name");

    // is Root category found?
    if (!rootCategory) {
      console.log({ message: "Root category not found!" });
      return;
    }

    let routeCategory: Category = rootCategory;

    if (routeData.cid !== null) {
      routeCategory = getCategoryById(dbcategories, routeData.cid) || routeCategory;
    }

    console.log("routeCategory:", routeCategory);

    // Create an tree array for selected category
    const getActiveCategoryRootTree = (): NavListElementType[] => {
      let activeCategory = routeCategory;
      const activeCategoryRootTree: NavListElementType[] = [];

      if (activeCategory.name !== "Root") {
        activeCategoryRootTree.push({
          category: routeCategory,
          route: `/category/${routeCategory.id}`,
        });

        // Loop until the parent reaches to Root add it to array of NavListElementType
        while (
          activeCategoryRootTree[activeCategoryRootTree.length - 1].category.id !== rootCategory?.id
        ) {
          const upperLevelParent = dbCategoriesSorted.find(
            (category) => activeCategory?.parentCategory?.id === category.id,
          );

          // Add it to array but not include the root category
          if (upperLevelParent && upperLevelParent.id !== rootCategory.id) {
            activeCategoryRootTree.splice(0, 0, {
              category: upperLevelParent,
              route: `/category/${upperLevelParent.id}`,
            });
            activeCategory = upperLevelParent;
          } else {
            break;
          }
        }
      }
      return activeCategoryRootTree;
    };
    // const result = getActiveCategoryRootTree();
    // setNavData(() => result);
    /**
     * IMPORTANT NOTES TO MYSELF
     * Create Final navData: Add Root Items and Categories using dbCategoriesSorted
     * 1. Check if the Root has it own items then sort them by name and add them too navData or
     * reconsider again how the items should be added to the navData. Maybe in? -> if (routeData?.type === "item")
     * 2. Add categories of Root with looping on them and check if the id equeal with activeCategoryRootTree[0] then add activeCategoryRootTree
     * and its own items -> if (routeData?.type === "item")
     */
  }, [routeData]);

  return (
    <div>
      {loading ? (
        <p>Loading Navigation Data...</p>
      ) : (
        <ul>
          {navData.map((element) => {
            return (
              <li key={element.category.id}>
                <Link to={`${BASE_URL}${element.route}`}>{element.category.name}</Link>
              </li>
            );
          })}
          <li key="c5">
            <Link to={`${BASE_URL}/category/5`}>Works</Link>
          </li>
          <li key="c3">
            <Link to={`${BASE_URL}/category/3`}>Printed Media</Link>
          </li>
          <li key="i1">
            <Link to={`${BASE_URL}/category/3/item/1`}>Garanti Bank Posters</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navigation;
