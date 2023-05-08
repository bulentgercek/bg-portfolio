import React, { useContext, useEffect, useState } from "react";

import { Item } from "../../api/interfaces";
import ItemGrid from "./ItemGrid";
import AppContext from "../../AppContext";
import { createCategoryItemList } from "../../utils/appUtils";

const CategoryItems: React.FC = () => {
  const { routeData, dbCategories } = useContext(AppContext);
  const [categoryItems, setCategoryItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!dbCategories || !routeData.cid) return;
    const categoryItemList = createCategoryItemList(dbCategories, routeData.cid);
    setCategoryItems(categoryItemList);
  }, [dbCategories, routeData]);

  const filterCategoryItems = (item: Item) => {
    const index = categoryItems.findIndex((categoryItem) => categoryItem.id === item.id);
    return index !== -1;
  };

  return (
    <div id="item_container" className="flex h-auto w-full">
      <ItemGrid filterFunction={filterCategoryItems} />
    </div>
  );
};

export default CategoryItems;
