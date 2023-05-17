import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { Asset, Content } from "../../api/interfaces";

/**
 * Image Gallery with Masonry FC
 * @returns JSX.ELement
 */
type ImageGalleryMasonryProps = {
  content: Content;
};

const ImageGalleryMasonry: React.FC<ImageGalleryMasonryProps> = ({ content }) => {
  const assets: Asset[] = content?.assets ?? [];
  const [masonryBreakpoints, setMasonryBreakPoints] = useState({});

  const sizes = [600, 1200];

  useEffect(() => {
    let newBreakPoints = { default: content.columns };

    for (let i = 0; i < content.columns; i++) {
      if (i > 0) newBreakPoints = { ...newBreakPoints, [sizes[i - 1]]: i };
    }

    setMasonryBreakPoints(newBreakPoints);
  }, []);

  const setSituationalMaxHeight = () => {
    return content.columns === 1 ? "max-h-[500px]" : "";
  };

  const setSituationalTextAlignment = () => {
    return content.columns === 1 ? "text-center" : "text-start";
  };

  return (
    <div>
      <Masonry breakpointCols={masonryBreakpoints} className="masonry-grid" columnClassName="masonry-grid_column">
        {assets.map((asset, index) => (
          <div key={`${asset.id}_${asset.name}`} className="mb-5 flex flex-col gap-2">
            <img
              className={`w-full object-contain ${setSituationalMaxHeight()}`}
              src={asset.url ?? ""}
              alt={asset.name}
              crossOrigin="anonymous"
              loading="lazy"
            />
            <p className={`text-sm italic text-indigo-700 ${setSituationalTextAlignment()}`}>{asset.name}</p>
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default ImageGalleryMasonry;
