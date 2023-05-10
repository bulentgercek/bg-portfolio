import React, { useContext, useEffect, useState } from "react";

import { Item } from "../../api/interfaces";
import ItemGrid, { SortOrderOptions } from "./ItemGrid";
import AppContext from "../../AppContext";
import { createCategoryItemList } from "../../utils/appUtils";

type CategoryItemsProps = {
  sortOrderOptions: SortOrderOptions;
};

const CategoryItems: React.FC<CategoryItemsProps> = ({ sortOrderOptions }) => {
  const { routeData, dbCategories } = useContext(AppContext);
  const [categoryItems, setCategoryItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!dbCategories || !routeData.cid) return;
    const categoryItemList = createCategoryItemList(dbCategories, routeData.cid);
    setCategoryItems(categoryItemList);
  }, [dbCategories, routeData, sortOrderOptions]);

  const filterCategoryItems = (item: Item) => {
    const index = categoryItems.findIndex((categoryItem) => categoryItem.id === item.id);
    return index !== -1;
  };

  return (
    <div id="item_container" className="flex h-auto w-full">
      <ItemGrid filterFunction={filterCategoryItems} sortOrderOptions={sortOrderOptions} />
    </div>
  );
};

export default CategoryItems;
