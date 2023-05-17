import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import ReactPlayer from "react-player/vimeo";
import { Asset, Content } from "../../api/interfaces";

/**
 * Video Gallery FC
 * @returns JSX.ELement
 */
type VideoGalleryProps = {
  content: Content;
};

const VideoGallery: React.FC<VideoGalleryProps> = ({ content }) => {
  const assets: Asset[] = content?.assets ?? [];
  const [masonryBreakpoints, setMasonryBreakPoints] = useState({});

  const sizes = [900, 1200];

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
          <div key={asset.id} className="relative" style={{ paddingTop: "56.25%" }}>
            <ReactPlayer
              url={asset.url ?? ""}
              className="absolute left-0 top-0"
              width="100%"
              height="100%"
              controls={true}
              playing={false}
            />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default VideoGallery;
