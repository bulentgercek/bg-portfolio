import { useContext, useEffect, useState } from "react";
import { createStateCollection, createStateData } from ".";
import { Item } from "../../api/interfaces";
import AppContext from "../../AppContext";
import { createKey } from "../../utils/appUtils";
import ItemDisplay from "./ItemDisplay";

// Content Sizes on CSS
const contentSizeVariables = {
  "--content-lg": 1015,
  "--content-md": 708,
  "--content-sm": 414,
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

const ItemGrid = () => {
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

    // Get featured items
    const featuredItems = dbItems.filter((item) => item.featured);

    // Get the total count of the itemDisplay
    const getItemDisplayValues = (featuredItems: Item[]) => {
      const itemCount = featuredItems.length;
      const columnCount = parseInt(activeStates.gridCol.split("-")[2]);
      const rowCount = Math.ceil(itemCount / columnCount);
      const emptyCount = columnCount * rowCount - itemCount;
      const totalCount = itemCount + emptyCount;
      return { itemCount, columnCount, rowCount, emptyCount, totalCount };
    };

    const itemDisplayValues = getItemDisplayValues(featuredItems);

    // Create and assign a new item[] and add null for the rest
    const createItemsList = <T extends typeof itemDisplayValues>(
      itemDisplayValues: T,
      featuredItems: Item[],
    ): (Item | null)[] => {
      if (!featuredItems) return [];
      const itemList: (Item | null)[] = [];
      let loopCount = 0;

      while (loopCount < itemDisplayValues.totalCount) {
        if (featuredItems[loopCount] !== undefined) {
          itemList.push(featuredItems[loopCount]);
        } else {
          itemList.push(null);
        }
        loopCount++;
      }
      return itemList;
    };

    const itemList = createItemsList(itemDisplayValues, featuredItems);

    setItemList(itemList);
  }, [activeStates]);

  return (
    <div className={`grid w-full ${activeStates.gridCol} gap-5`}>
      {itemList.map((item) => (
        <ItemDisplay key={(item && `${item.id}`) ?? createKey()} item={item} />
      ))}
    </div>
  );
};

export default ItemGrid;
