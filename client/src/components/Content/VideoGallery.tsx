import React, { useEffect, useRef, useState } from "react";
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
  const [masonryBreakpoints, setMasonryBreakPoints] = useState({});
  const playerRefs = useRef<(HTMLElement | null)[]>([]);
  const sizes = [600, 1200];

  useEffect(() => {
    let newBreakPoints = { default: content.columns };

    for (let i = 0; i < content.columns; i++) {
      if (i > 0) newBreakPoints = { ...newBreakPoints, [sizes[i - 1]]: i };
    }

    setMasonryBreakPoints(newBreakPoints);
  }, []);

  useEffect(() => {
    assets.forEach((asset, index) => {
      if (playerRefs.current[index] !== null) {
        const player = new Player(playerRefs.current[index] as HTMLElement, {
          url: asset.url ?? undefined,
          controls: true,
          responsive: true,
        });

        // Event listener for multiple videos
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
    <div className="flex flex-col items-center justify-center gap-5">
      {assets.map((asset, index) => (
        <div
          key={asset.id}
          ref={(el) => (playerRefs.current[index] = el)}
          className="m-auto h-auto w-full max-w-[800px]"
        />
      ))}
    </div>
  );
};

export default VideoGallery;
