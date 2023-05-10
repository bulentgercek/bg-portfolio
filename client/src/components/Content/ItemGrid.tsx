import { useContext, useEffect, useState } from "react";
import { createStateCollection, createStateData } from ".";
import { Item } from "../../api/interfaces";
import AppContext from "../../AppContext";
import { createKey } from "../../utils/appUtils";
import { sortDbArray } from "../../utils/dbUtils";
import ItemDisplay from "./ItemDisplay";

// Content Sizes on CSS
const contentSizeVariables = {
  "--content-lg": 1015,
  "--content-md": 708,
  "--content-sm": 460,
};

const stateData = createStateData({
  gridCol: {
    c4: "grid-cols-4",
    c3: "grid-cols-3",
    c2: "grid-cols-2",
    c1: "grid-cols-1",
  },
});

const stateCollection = createStateCollection(stateData, {
  minLg: {
    gridCol: stateData.gridCol.c4,
  },
  minMd: {
    gridCol: stateData.gridCol.c3,
  },
  minSm: {
    gridCol: stateData.gridCol.c2,
  },
  maxSm: {
    gridCol: stateData.gridCol.c1,
  },
});

export type SortOrderOptions = {
  orderBy?: "orderByName" | "orderByDate";
  order?: "asc" | "desc";
};

type ItemGridProps = {
  filterFunction: (item: Item) => boolean | null;
  sortOrderOptions?: SortOrderOptions;
};

const ItemGrid: React.FC<ItemGridProps> = ({ filterFunction, sortOrderOptions }) => {
  const { dbItems, contentSizeData } = useContext(AppContext);
  const [activeStates, setActiveStates] = useState(stateCollection.maxSm);
  const [itemList, setItemList] = useState<(Item | null)[]>([]);

  useEffect(() => {
    if (!contentSizeData) return;

    const determineActiveState = (width: number) => {
      if (width < contentSizeVariables["--content-sm"]) return stateCollection.maxSm;
      if (width < contentSizeVariables["--content-md"]) return stateCollection.minSm;
      if (width < contentSizeVariables["--content-lg"]) return stateCollection.minMd;
      return stateCollection.minLg;
    };

    setActiveStates(determineActiveState(contentSizeData.width));
  }, [contentSizeData]);

  useEffect(() => {
    if (!dbItems) return;

    let updatedItems: Item[];

    // Get filtrered items
    updatedItems = dbItems.filter(filterFunction);

    // Sort filtered items
    const sortItems = (items: Item[], options: SortOrderOptions): Item[] => {
      const finalOrderBy = options.orderBy === "orderByName" ? "name" : "date";
      return sortDbArray(items, finalOrderBy, options.order);
    };

    if (sortOrderOptions) updatedItems = sortItems(updatedItems, sortOrderOptions);

    // Get the total count of the itemDisplay
    const getItemDisplayCount = (items: Item[]): number => {
      const itemCount = items.length;
      const columnCount = parseInt(activeStates.gridCol.split("-")[2]);
      const rowCount = Math.ceil(itemCount / columnCount);
      const emptyCount = columnCount * rowCount - itemCount;
      const totalCount = itemCount + emptyCount;
      return totalCount;
    };

    const itemDisplayCount = getItemDisplayCount(updatedItems);

    // Create and assign a new item[] and add null for the rest
    const createItemsList = (itemDisplayCount: number, items: Item[]): (Item | null)[] => {
      if (!items) return [];
      let itemList: (Item | null)[] = [];

      for (let i = 0; i < itemDisplayCount; i++) {
        itemList.push(items[i] ?? null);
      }
      return itemList;
    };

    const itemList = createItemsList(itemDisplayCount, updatedItems);

    setItemList(itemList);
  }, [activeStates, dbItems, filterFunction]);

  return (
    <div className={`grid w-full ${activeStates.gridCol} gap-5`}>
      {itemList.map((item) => (
        <ItemDisplay key={(item?.id ?? createKey()).toString()} item={item} />
      ))}
    </div>
  );
};

export default ItemGrid;
