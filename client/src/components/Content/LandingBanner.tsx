import React, { useContext } from "react";
import AppContext from "../../AppContext";

/**
 * Content Area Size Notes
 * 1. min-width: 1200
 * 2. min-width: 1015
 * 3. min-width: 895
 * 4. min-width: 560
 * 5. < 560
 */

const LandingBanner: React.FC = () => {
  const { contentSizeData } = useContext(AppContext);
  return (
    <div id="landing_banner_container" className="flex-none flex-grow-0 self-stretch rounded-2xl border bg-indigo-50">
      <div id="landing_banner" className="flex flex-row items-center gap-5 border p-10 pl-7">
        <div>
          Hello! My name is Bulent Gercek. You can find my past and current notable works on this personal website. I
          wish to meet you one day. Happy surfing 🤗
        </div>
        <div className="font-bold">{Math.round(contentSizeData?.width ?? 0)}</div>
      </div>
      <div id="landing_banner_back" className=""></div>
    </div>
  );
};

export default LandingBanner;
