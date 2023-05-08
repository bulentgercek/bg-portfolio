import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../AppContext";
import { createKey } from "../../utils/appUtils";

type BcNavRoute = {
  name: string;
  route: string;
};

type BcPageProps = {
  pageType: "Category" | "Item";
};

const Breadcrumbs: React.FC<BcPageProps> = ({ pageType }) => {
  const { breadcrumbs, navData } = useContext(AppContext);
  const [bcNavigation, setBcNavigation] = useState<BcNavRoute[]>([]);

  useEffect(() => {
    const createBcNavigation = () => {
      const newBcNavigation: BcNavRoute[] = [];
      newBcNavigation.push({ name: "Home", route: "/" });

      for (let i = 0; i < breadcrumbs.length; i++) {
        const bcRoute = `/category/${breadcrumbs[i].id}`;
        if (pageType === "Category" && i === breadcrumbs.length - 1) continue;
        newBcNavigation.push({
          name: breadcrumbs[i].name,
          route: bcRoute || "",
        });
      }
      return newBcNavigation;
    };

    const newBcNavigation = createBcNavigation();
    setBcNavigation(newBcNavigation);
  }, [navData]);

  return (
    <div className="flex flex-row gap-2.5 font-bold text-indigo-500">
      {bcNavigation.map((bcNavElement, index) => (
        <React.Fragment key={bcNavElement.name + index}>
          <Link key={createKey()} to={bcNavElement.route}>
            <div
              className={`${
                index === bcNavigation.length - (pageType === "Category" ? 1 : 1)
                  ? `text-indigo-700`
                  : `text-indigo-500`
              }`}
            >
              {bcNavElement.name}
            </div>
          </Link>
          {index !== bcNavigation.length - 1 && <span>{">"}</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
