import React, { useContext, useEffect, useState } from "react";
import { Category } from "../../api/interfaces";
import AppContext from "../../AppContext";
import Breadcrumbs from "../../components/Content/Breadcrumbs";
import CategoryItems from "../../components/Content/CategoryItems";

const CategoryContentLayout: React.FC = () => {
  const { breadcrumbs, routeData } = useContext(AppContext);
  const [currentCategory, setCurrentCategory] = useState<Category>();

  useEffect(() => {
    const newCategory = breadcrumbs.find((bc) => bc.id === routeData.cid);
    if (newCategory) setCurrentCategory(newCategory);
  }, [routeData]);

  return (
    <div className="flex flex-col gap-2.5 rounded-2xl bg-blue-200 p-5">
      {/* Header */}
      <div className="flex w-full flex-row rounded-xl bg-blue-100 p-5">
        <div className="flex flex-col gap-2">
          <Breadcrumbs pageType="Category" />
          <div>
            <div className="text-lg font-bold text-indigo-900">{currentCategory?.name}</div>
            <div className="">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut vehicula sem, quis tincidunt
              metus. Fusce at arcu nec tortor suscipit convallis non sit amet nulla.
            </div>
          </div>
        </div>
        <div className="flex min-w-[218px] p-5">Info Panel</div>
      </div>

      {/* Navigation */}
      <div className="flex h-12 items-center">Navigation Panel</div>

      {/* Category Items Component */}
      <CategoryItems />
    </div>
  );
};

export default CategoryContentLayout;
