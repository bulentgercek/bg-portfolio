import React from "react";
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

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[800px]" style={{ paddingTop: "56.25%" }}>
        {assets.map((asset, index) => (
          <ReactPlayer
            key={index}
            url={asset.url ?? ""}
            className="absolute left-0 top-0"
            width="100%"
            height="100%"
            controls={true}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
