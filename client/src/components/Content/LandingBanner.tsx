import React, { useContext, useEffect, useState } from "react";

import bg_photo from "../../assets/bg_photo.png";
import icon_linkedin from "../../assets/icon_linkedin.svg";
import icon_github from "../../assets/icon_github.svg";
import icon_twitter from "../../assets/icon_twitter.svg";
import landing_banner_back_circles from "../../assets/landing_banner_back_circles.svg";
import AppContext from "../../AppContext";
import { createStateCollection, createStateData } from ".";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";
import { createNavElementKey } from "../../utils/navigationUtils";

// Create State
const stateData = createStateData({
  landingBannerDirection: {
    rowNAlignCenter: "flex-row items-center",
    colNAlignStart: "flex-col items-start",
  },
  textNButtonsOrder: {
    order1: "order-1",
    order2: "order-2",
  },
  photoNLinksOrder: {
    order1: "order-1",
    order2: "order-2",
  },
  photoNLinksDirection: {
    row: "flex-row",
    col: "flex-col",
  },
  photoNLinksWidth: {
    wMaxSm: "w-full",
    wMinSm: "w-[200px]",
    wMinMd: "w-[250px]",
    wMinLg: "w-[250px]",
    wMinXl: "w-[350px]",
  },
  linksDirection: {
    row: "flex-row",
    col: "flex-col",
  },
  landingBannerCirclesRPos: {
    wMaxSm: "right-[420px]",
    wMinSm: "right-[350px]",
    wMinMd: "right-[220px]",
    wMinLg: "right-[120px]",
    wMinXl: "right-[100px]",
  },
});

const stateCollection = createStateCollection(stateData, {
  minXl: {
    landingBannerDirection: stateData.landingBannerDirection.rowNAlignCenter,
    textNButtonsOrder: stateData.textNButtonsOrder.order1,
    photoNLinksOrder: stateData.photoNLinksOrder.order2,
    photoNLinksDirection: stateData.photoNLinksDirection.row,
    photoNLinksWidth: stateData.photoNLinksWidth.wMinXl,
    linksDirection: stateData.linksDirection.row,
    landingBannerCirclesRPos: stateData.landingBannerCirclesRPos.wMinXl,
  },
  minLg: {
    landingBannerDirection: stateData.landingBannerDirection.rowNAlignCenter,
    textNButtonsOrder: stateData.textNButtonsOrder.order1,
    photoNLinksOrder: stateData.photoNLinksOrder.order2,
    photoNLinksDirection: stateData.photoNLinksDirection.row,
    photoNLinksWidth: stateData.photoNLinksWidth.wMinLg,
    linksDirection: stateData.linksDirection.col,
    landingBannerCirclesRPos: stateData.landingBannerCirclesRPos.wMinLg,
  },
  minMd: {
    landingBannerDirection: stateData.landingBannerDirection.rowNAlignCenter,
    textNButtonsOrder: stateData.textNButtonsOrder.order1,
    photoNLinksOrder: stateData.photoNLinksOrder.order2,
    photoNLinksDirection: stateData.photoNLinksDirection.row,
    photoNLinksWidth: stateData.photoNLinksWidth.wMinMd,
    linksDirection: stateData.linksDirection.col,
    landingBannerCirclesRPos: stateData.landingBannerCirclesRPos.wMinMd,
  },
  minSm: {
    landingBannerDirection: stateData.landingBannerDirection.rowNAlignCenter,
    textNButtonsOrder: stateData.textNButtonsOrder.order1,
    photoNLinksOrder: stateData.photoNLinksOrder.order2,
    photoNLinksDirection: stateData.photoNLinksDirection.col,
    photoNLinksWidth: stateData.photoNLinksWidth.wMinSm,
    linksDirection: stateData.linksDirection.row,
    landingBannerCirclesRPos: stateData.landingBannerCirclesRPos.wMinSm,
  },
  maxSm: {
    landingBannerDirection: stateData.landingBannerDirection.colNAlignStart,
    textNButtonsOrder: stateData.textNButtonsOrder.order2,
    photoNLinksOrder: stateData.photoNLinksOrder.order1,
    photoNLinksDirection: stateData.photoNLinksDirection.row,
    photoNLinksWidth: stateData.photoNLinksWidth.wMaxSm,
    linksDirection: stateData.linksDirection.col,
    landingBannerCirclesRPos: stateData.landingBannerCirclesRPos.wMaxSm,
  },
});

// Content Sizes
const contentSizeVariables = {
  "--content-xl": 1200,
  "--content-lg": 1015,
  "--content-md": 895,
  "--content-sm": 560,
};

/**
 * Landing Banner Component
 */
const LandingBanner: React.FC = () => {
  const { contentSizeData, navData } = useContext(AppContext);
  const [activeStates, setActiveStates] = useState(stateCollection.maxSm);

  useEffect(() => {
    if (!contentSizeData) return;

    const determineActiveState = (width: number) => {
      if (width < contentSizeVariables["--content-sm"]) return stateCollection.maxSm;
      if (width < contentSizeVariables["--content-md"]) return stateCollection.minSm;
      if (width < contentSizeVariables["--content-lg"]) return stateCollection.minMd;
      if (width < contentSizeVariables["--content-xl"]) return stateCollection.minLg;
      return stateCollection.minXl;
    };

    setActiveStates(determineActiveState(contentSizeData.width));
  }, [contentSizeData]);

  return (
    <div id="landing_banner_container" className="relative flex w-full overflow-hidden rounded-2xl border">
      <div
        id="landing_banner"
        className={`z-10 flex w-full gap-5 p-10 pl-7 text-xl text-indigo-900 ${activeStates.landingBannerDirection}`}
      >
        <div
          id="text_n_buttons"
          className={`flex h-full flex-1 flex-col justify-between gap-5 ${activeStates.textNButtonsOrder}`}
        >
          <div id="text">
            <p>
              <span className="font-bold">Hello! My name is Bulent Gercek.</span> I am currently on my way as a{" "}
              <span className="font-semibold">Full Stack Web Application Developer</span>. In this personal website, you
              can find my notable works that I have produced in different professional fields throughout my business
              life. I wish to meet you one day. Happy surfing 🤗
              {/* <span className="text-gray-400">{Math.round(contentSizeData?.width ?? 0)}</span> */}
            </p>
          </div>
          {(navData && navData.length >= 2 && (
            <div className="flex flex-row flex-wrap gap-3">
              {navData.map((rootNavElement, index) => (
                <Link to={`${rootNavElement.route}`} key={createNavElementKey(rootNavElement)}>
                  <button
                    className={`trans-d500 flex h-[40px] items-center rounded-2xl ${
                      index % 2 === 0 ? `bg-blue-600` : `bg-purple-600`
                    } px-5 py-3 text-base 
                font-bold text-indigo-50 hover:px-6`}
                  >
                    {`${rootNavElement.element.name}`}
                  </button>
                </Link>
              ))}
            </div>
          )) ?? <Spinner />}
        </div>
        <div
          id="photo_n_links"
          className={`flex items-center justify-between gap-[10px] ${activeStates.photoNLinksWidth} ${activeStates.photoNLinksDirection} ${activeStates.photoNLinksOrder}`}
        >
          <div>
            <img id="photo" className="w-[175px]" src={bg_photo} alt="bg_logo"></img>
          </div>
          <div id="links" className={`flex items-center justify-center gap-[10px] ${activeStates.linksDirection}`}>
            <a href="https://www.linkedin.com/in/bulentgercek/" target="_blank">
              <img
                className="trans-d500 hover:-translate-y-0.5 hover:brightness-200"
                src={icon_linkedin}
                alt="icon_linkedin"
              />
            </a>
            <a href="https://github.com/bulentgercek" target="_blank">
              <img
                className="trans-d500 hover:-translate-y-0.5 hover:brightness-200"
                src={icon_github}
                alt="icon_github"
              />
            </a>
            <a href="https://twitter.com/bulentgercek" target="_blank">
              <img
                className="trans-d500 hover:-translate-y-0.5 hover:brightness-200"
                src={icon_twitter}
                alt="icon_twitter"
              />
            </a>
          </div>
        </div>
      </div>
      <div
        id="landing_banner_back"
        className="absolute left-[calc(50%-1358px/2)] top-[calc(50%-680px/2)] z-0 h-[680px] w-[1358px] bg-indigo-50"
      >
        <img
          className={`trans-d500 absolute top-[200px] opacity-[0.25] ${activeStates.landingBannerCirclesRPos}`}
          src={landing_banner_back_circles}
          alt="landing_banner_back"
        ></img>
      </div>
    </div>
  );
};

export default LandingBanner;
