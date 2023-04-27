import React, { useContext, useEffect, useState } from "react";

import bg_photo from "../../assets/bg_photo.png";
import icon_linkedin from "../../assets/icon_linkedin.svg";
import icon_github from "../../assets/icon_github.svg";
import icon_twitter from "../../assets/icon_twitter.svg";
import { getCustomCSSVariables } from "../../../utils";
import AppContext from "../../AppContext";
import { createStateCollection, createStateData } from ".";

// State Consts
const stateData = createStateData({
  linksDirection: {
    row: "flex-row",
    col: "flex-col",
  },
  buttonsDirection: {
    row: "flex-row",
    col: "flex-col",
  },
});

const stateCollection = createStateCollection(stateData, (stateData) => ({
  openStates: {
    linksDirection: stateData.linksDirection.row,
    buttonsDirection: stateData.buttonsDirection.row,
  },
  closeStates: {
    linksDirection: stateData.linksDirection.col,
    buttonsDirection: stateData.buttonsDirection.col,
  },
}));

/**
 * Landing Banner Component
 */
const LandingBanner: React.FC = () => {
  const { contentSizeData } = useContext(AppContext);
  const [activeStates, setActiveStates] = useState(stateCollection.openStates);
  const [isSmall, setIsSmall] = useState<boolean>(false);

  useEffect(() => {
    const contentCSSVariables = getCustomCSSVariables("--content");

    setIsSmall(contentSizeData ? contentSizeData.width < contentCSSVariables["--content-sm"] : false);
  }, [contentSizeData]);

  useEffect(() => {
    console.clear();
    console.log("activeStates:", JSON.stringify(activeStates, null, 2));
  }, [activeStates]);

  return (
    <div id="landing_banner_container" className="flex-none flex-grow-0 self-stretch rounded-2xl border bg-indigo-50">
      <div
        id="landing_banner"
        className={`flex ${
          isSmall ? `flex-col items-start` : `flex-row items-center`
        }  gap-5 p-10 pl-7 text-xl text-indigo-900`}
      >
        <div id="text_n_buttons" className={`flex flex-col gap-5  ${isSmall ? `order-2` : `order-1`}`}>
          <div id="text">
            <p>
              <span className="font-bold">Hello! My name is Bulent Gercek.</span> You can find my past and current
              notable works on this personal website. I wish to meet you one day. Happy surfing 🤗
              <span className="text-gray-400">{Math.round(contentSizeData?.width ?? 0)}</span>
            </p>
          </div>
          <div>Buttons</div>
        </div>
        <div
          id="photo_n_links"
          className={`flex w-full flex-row justify-between gap-[10px] border-0 border-red-400 ${
            isSmall ? `order-1` : `order-2`
          }`}
        >
          <div>
            <img id="photo" src={bg_photo} alt="bg_logo"></img>
          </div>
          <div id="links" className="flex flex-col items-center justify-center gap-[10px] border-0 border-red-400">
            <img src={icon_linkedin} alt="icon_linkedin" />
            <img src={icon_github} alt="icon_github" />
            <img src={icon_twitter} alt="icon_twitter" />
          </div>
        </div>
      </div>
      <div id="landing_banner_back" className=""></div>
    </div>
  );
};

export default LandingBanner;
