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
    <div className="flex h-fit flex-col gap-5">
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
    </div>
  );
};

export default VideoGallery;
