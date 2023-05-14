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
    <div>
      {assets.map((asset, index) => (
        <div key={asset.id}>
          <ReactPlayer url={asset.url ?? ""} width="100%" height="auto" controls={true} playing={false} />
        </div>
      ))}
    </div>
  );
};

export default VideoGallery;
