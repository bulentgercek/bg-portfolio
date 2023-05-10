import React, { useContext } from "react";
import AppContext from "../../AppContext";
import Breadcrumbs from "../../components/Content/Breadcrumbs";

const ItemContentLayout: React.FC = () => {
  const { breadcrumbs, routeData, dbItems } = useContext(AppContext);
  const currentCategory = breadcrumbs.find((bc) => bc.id === routeData.cid);
  const currentItem = dbItems?.find((bc) => bc.id === routeData.iid);

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-blue-200 p-5 pt-10">
      {/* Header */}
      <div className="flex w-full flex-row rounded-xl bg-blue-100 p-5">
        <div className="flex flex-col gap-2">
          <Breadcrumbs pageType="Item" />
        </div>
      </div>
      {/* Item Description */}
      <div className="flex w-full flex-row rounded-xl bg-blue-100 p-5">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold text-indigo-900">{currentItem?.name}</div>
          <div className="text-base text-indigo-900">{currentItem?.description}</div>
        </div>
      </div>

      {/* Item Content */}
      <div>Item Contents</div>
    </div>
  );
};

export default ItemContentLayout;
