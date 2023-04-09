import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BASE_URL, NavListElementType, NavListItemClass } from ".";
import { Api } from "../api";
import { Category } from "../api/interfaces";

interface NavigationProps {
  value: string;
}

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

const Navigation: React.FC<NavigationProps> = ({ value }) => {
  const [navData, setNavData] = useState<NavListElementType[]>([]);
  const [dbcategories, setDbCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Preventing the strict mode multiple calls on dev environment
  const isMountedRef = useRef(false);

  // Navigation variables and functions
  const location = useLocation();

  const createKey = (navListElement: NavListElementType) => {
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

  useEffect(() => {
    if (!isMountedRef.current) {
      setNavData((prev) => prev.concat(rootNavData));
      isMountedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const fetchResult = await Api.getCategories();
      setDbCategories(fetchResult);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {navData.map((category) => {
            if (category.parentCategory === undefined)
              return (
                <li key={createKey(category)} className="cursor-pointer">
                  <Link to={`${BASE_URL}${category.route}`}>
                    {category.name}
                  </Link>
                </li>
              );
            else if (category.parentCategory !== null)
              return (
                <li key={createKey(category)} className="cursor-pointer px-1">
                  <Link to={`${BASE_URL}${category.route}`}>
                    {category.name}
                  </Link>
                </li>
              );
          })}
        </ul>
      )}
    </div>
  );
};

export default Navigation;
