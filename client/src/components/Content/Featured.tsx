import React from "react";
import { Item } from "../../api/interfaces";
import ItemGrid from "./ItemGrid";

const Featured: React.FC = () => {
  const filterFeaturedItems = (item: Item) => item.featured;

  return (
    <div id="featured" className="flex flex-col rounded-2xl bg-blue-200 p-5 pt-2.5">
      <div id="header" className="h-6 w-full text-center font-semibold text-blue-800">
        Featured Works
      </div>
      <div id="item_container" className="flex h-auto w-full">
        <ItemGrid filterFunction={filterFeaturedItems} />
      </div>
    </div>
  );
};

export default Featured;
