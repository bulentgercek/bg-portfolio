import Masonry from "react-masonry-css";
import { Asset, Content } from "../../api/interfaces";

/**
 * Image Gallery with Masonry
 * @returns JSX.ELement
 */
type ImageGalleryMasonryProps = {
  content: Content;
};

const ImageGalleryMasonry: React.FC<ImageGalleryMasonryProps> = ({ content }) => {
  const assets: Asset[] = content?.assets ?? [];

  const masonryBreakpoints = {
    default: 3,
    1200: 2,
    600: 1,
  };

  return (
    <div>
      <Masonry breakpointCols={masonryBreakpoints} className="masonry-grid" columnClassName="masonry-grid_column">
        {assets.map((asset, index) => (
          <div key={`${asset.id}_${asset.name}`} className="mb-5 flex flex-col gap-2">
            <img src={asset.url ?? ""} alt={`Gallery item ${index + 1}`} crossOrigin="anonymous" loading="lazy" />
            <p>{asset.name}</p>
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default ImageGalleryMasonry;
