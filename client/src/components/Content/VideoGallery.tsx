import React, { useEffect, useRef } from "react";
import Player from "@vimeo/player";
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
  const playerRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    assets.forEach((asset, index) => {
      if (playerRefs.current[index] !== null) {
        const player = new Player(playerRefs.current[index] as HTMLElement, {
          url: asset.url ?? undefined,
          controls: true,
          responsive: true,
        });

        // Example of an event listener
        player.on("play", () => {
          console.log(`Video ${index} is playing`);
        });
      }
    });

    return () => {
      // Clean up players on unmount
      playerRefs.current.forEach((playerElement, index) => {
        if (playerElement !== null) {
          const player = new Player(playerElement);
          player.unload();
          playerRefs.current[index] = null;
        }
      });
    };
  }, [assets]);

  return (
    <div>
      {assets.map((asset, index) => (
        <div key={asset.id} ref={(el) => (playerRefs.current[index] = el)} className="video-player" />
      ))}
    </div>
  );
};

export default VideoGallery;
