import React from "react";
import ItemDisplay from "./ItemDisplay";

const ItemGrid = () => {
  return (
    <div className="grid w-full grid-cols-3 gap-5">
      <ItemDisplay />
    </div>
  );
};

export default ItemGrid;
