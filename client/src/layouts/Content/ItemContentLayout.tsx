import React, { useContext } from "react";

import go_category from "../../assets/go_category.png";
import AppContext from "../../AppContext";
import Breadcrumbs from "../../components/Content/Breadcrumbs";
import { Link } from "react-router-dom";
import Masonry from "react-masonry-css";

const ItemContentLayout: React.FC = () => {
  const { breadcrumbs, routeData, dbItems } = useContext(AppContext);
  const currentCategory = breadcrumbs.find((bc) => bc.id === routeData.cid);
  const currentItem = dbItems?.find((bc) => bc.id === routeData.iid);

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

      {/* Item Content */}
      <ImageGalleryMasonry />
    </div>
  );
};

/**
 *
 * @returns
 */

const ImageGalleryMasonry: React.FC = () => {
  // Add your image URLs here
  const imageUrls = [
    "http://localhost:3000/uploads/1683287625747-anadolu_insurance_1.png",
    "http://localhost:3000/uploads/1683375632915-garanti_bank_basket.jpg",
    "http://localhost:3000/uploads/anadolu_sigorta_koltuk_making_of.jpg",
    "http://localhost:3000/uploads/anadolu_sigorta_koltuk_making_of.jpg",
    "http://localhost:3000/uploads/1683375632915-garanti_bank_basket.jpg",
    "http://localhost:3000/uploads/anadolu_sigorta_koltuk_making_of.jpg",
  ];

  const masonryBreakpoints = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div>
      <Masonry breakpointCols={masonryBreakpoints} className="masonry-grid" columnClassName="masonry-grid_column">
        {imageUrls.map((url, index) => (
          <div key={index} className="masonry-item">
            <img src={url} alt={`Gallery item ${index + 1}`} crossOrigin="anonymous" loading="lazy" />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

/**
 *
 * @returns
 */
const TextBlock: React.FC = () => {
  return <div>TextBlock</div>;
};

export default ItemContentLayout;
