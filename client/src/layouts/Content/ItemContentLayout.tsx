import React, { useContext } from "react";

import go_category from "../../assets/go_category.png";
import AppContext from "../../AppContext";
import Breadcrumbs from "../../components/Content/Breadcrumbs";
import { Link } from "react-router-dom";
import { sortDbArray } from "../../utils/dbUtils";
import { Content } from "../../api/interfaces";
import ImageGalleryMasonry from "../../components/Content/ImageGalleryMasonry";
import TextBlock from "../../components/Content/TextBlock";

const ItemContentLayout: React.FC = () => {
  const { breadcrumbs, routeData, dbItems } = useContext(AppContext);
  const currentCategory = breadcrumbs.find((bc) => bc.id === routeData.cid);
  const currentItem = dbItems?.find((bc) => bc.id === routeData.iid);

  const itemContents = (): JSX.Element => {
    const currentItemContents = currentItem?.contents;
    if (!currentItemContents || currentItemContents?.length === 0) return <></>;

    const sortedItemContents: Content[] = sortDbArray(currentItemContents, "orderId");

    return (
      <div id="item_contents">
        {sortedItemContents.map((itemContent) => {
          if (itemContent.type === "imageGalleryMasonry")
            return <ImageGalleryMasonry key={itemContent.id} content={itemContent} />;
          if (itemContent.type === "textBlock") return <TextBlock key={itemContent.id} content={itemContent} />;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-blue-200 p-5 pt-10">
      {/* Header */}
      <div className="flex w-full rounded-xl bg-blue-100 p-5">
        <Breadcrumbs pageType="Item" />
      </div>
      {/* Item Name and Description */}
      <div className="flex w-full flex-col gap-5 rounded-xl bg-blue-100 p-5">
        <div id="header" className="flex flex-row items-center gap-2.5">
          <Link to={`/category/${currentCategory?.id}`}>
            <img
              className="trans-d500 min-h-[45px] min-w-[45px] hover:-translate-y-1 hover:brightness-200"
              src={go_category}
              alt="go_category"
            ></img>
          </Link>
          <div className="text-lg font-bold text-indigo-900">{currentItem?.name}</div>
        </div>
        <div id="description" className="text-base text-indigo-900">
          {currentItem?.description}
        </div>
      </div>

      {/* Item Contents */}
      {itemContents()}
    </div>
  );
};

export default ItemContentLayout;
