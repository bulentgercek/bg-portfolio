import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  BASE_URL,
  NavListElementType,
  NavListItemClass,
  RouteDataType,
} from ".";
import { Api } from "../api";
import { Category } from "../api/interfaces";
import { getNavlistElements, createKey } from "../utils";

type NavigationProps = {
  value: string;
};

// Init values for navData state
const rootNavData: NavListElementType[] = [
  {
    id: 0,
    name: "About",
    route: "/about",
    class: NavListItemClass.About,
  },
  {
    id: 0,
    name: "Works",
    route: "/works",
    class: NavListItemClass.Works,
  },
  {
    id: 1,
    name: "Printed Media",
    route: "/works/?categoryId=1",
    parentCategory: null,
    class: NavListItemClass.Category,
  },
  {
    id: 1,
    name: "Garanti Bank Posters",
    route: "/works/?categoryId=1&itemId=1",
    parentCategory: 1,
    class: NavListItemClass.Item,
  },
];

/**
 * Navigation Function Component
 */
const Navigation: React.FC<NavigationProps> = ({ value }) => {
  const [dbcategories, setDbCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [routeData, setRouteData] = useState<RouteDataType>();
  const [navData, setNavData] = useState<NavListElementType[]>([
    ...rootNavData,
  ]);

  // Ref variable to see Routes first time it updated without waiting the second render
  // But remember that is not a good approach Bulent :D
  const routeDataRef = useRef<RouteDataType>({} as RouteDataType);

  // Navigation variables and functions
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  useEffect(() => {
    const newRouteData = {
      rootRoute: location.pathname.replace(/^\/|\/$/g, ""),
      categoryId: urlParams.get("categoryId"),
      itemId: urlParams.get("itemId"),
    };
    setRouteData(() => newRouteData);

    // Console log current value of routeData state
    routeDataRef.current = newRouteData;
    console.log(routeDataRef.current);
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchResult = await Api.getCategories();
      setDbCategories(fetchResult);
      setLoading(false);
    };
    fetchData();
    console.log(dbcategories);
  }, []);

  // console.log(getNavlistElements(navData, "id", 1));

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {navData.map((category) => {
            return (
              <li key={createKey(category)} className={`cursor-pointer`}>
                <Link to={`${BASE_URL}${category.route}`}>{category.name}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Navigation;
