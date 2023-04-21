import React from "react";

const Featured: React.FC = () => {
  return (
    <div id="featured" className="flex flex-col items-start rounded-2xl bg-blue-200 p-5 pt-2.5">
      <div id="header" className="h-6 w-full text-center font-semibold text-blue-800">
        Featured Works
      </div>
      <div id="item_container" className="flex h-[350px] w-full flex-row gap-5">
        <div className="w-1/3 rounded-2xl bg-indigo-50/50 "></div>
        <div className="w-1/3 rounded-2xl bg-indigo-50/50"></div>
        <div className="w-1/3 rounded-2xl bg-indigo-50/50"></div>
      </div>
    </div>
  );
};

export default Featured;
