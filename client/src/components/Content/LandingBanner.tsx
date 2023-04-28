import React, { useContext, useEffect, useState } from "react";

import bg_photo from "../../assets/bg_photo.png";
import icon_linkedin from "../../assets/icon_linkedin.svg";
import icon_github from "../../assets/icon_github.svg";
import icon_twitter from "../../assets/icon_twitter.svg";
import AppContext from "../../AppContext";
import { createStateCollection, createStateData } from ".";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";
import { getRootElementCount, isNavDataFilled } from "../../utils/navigationUtils";
import { getCustomCSSVariables } from "../../utils/appUtils";

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
});

const stateCollection = createStateCollection(stateData, {
  minXl: {
    landingBannerDirection: stateData.landingBannerDirection.rowNAlignCenter,
    textNButtonsOrder: stateData.textNButtonsOrder.order1,
    photoNLinksOrder: stateData.photoNLinksOrder.order2,
    photoNLinksDirection: stateData.photoNLinksDirection.row,
    photoNLinksWidth: stateData.photoNLinksWidth.wMinXl,
    linksDirection: stateData.linksDirection.row,
  },
  minLg: {
    landingBannerDirection: stateData.landingBannerDirection.rowNAlignCenter,
    textNButtonsOrder: stateData.textNButtonsOrder.order1,
    photoNLinksOrder: stateData.photoNLinksOrder.order2,
    photoNLinksDirection: stateData.photoNLinksDirection.row,
    photoNLinksWidth: stateData.photoNLinksWidth.wMinLg,
    linksDirection: stateData.linksDirection.col,
  },
  minMd: {
    landingBannerDirection: stateData.landingBannerDirection.rowNAlignCenter,
    textNButtonsOrder: stateData.textNButtonsOrder.order1,
    photoNLinksOrder: stateData.photoNLinksOrder.order2,
    photoNLinksDirection: stateData.photoNLinksDirection.row,
    photoNLinksWidth: stateData.photoNLinksWidth.wMinMd,
    linksDirection: stateData.linksDirection.col,
  },
  minSm: {
    landingBannerDirection: stateData.landingBannerDirection.rowNAlignCenter,
    textNButtonsOrder: stateData.textNButtonsOrder.order1,
    photoNLinksOrder: stateData.photoNLinksOrder.order2,
    photoNLinksDirection: stateData.photoNLinksDirection.col,
    photoNLinksWidth: stateData.photoNLinksWidth.wMinSm,
    linksDirection: stateData.linksDirection.row,
  },
  maxSm: {
    landingBannerDirection: stateData.landingBannerDirection.colNAlignStart,
    textNButtonsOrder: stateData.textNButtonsOrder.order2,
    photoNLinksOrder: stateData.photoNLinksOrder.order1,
    photoNLinksDirection: stateData.photoNLinksDirection.row,
    photoNLinksWidth: stateData.photoNLinksWidth.wMaxSm,
    linksDirection: stateData.linksDirection.col,
  },
});

/**
 * Landing Banner Component
 */
const LandingBanner: React.FC = () => {
  const { dbCategories, dbItems, breadcrumbs, contentSizeData, navData } = useContext(AppContext);
  const [landingBannerLoading, setLandingBannerLoading] = useState<boolean>(true);
  const [activeStates, setActiveStates] = useState(stateCollection.maxSm);

  useEffect(() => {
    if (!dbCategories || !dbItems || !navData) return;
    const rootElementCount = getRootElementCount(dbCategories, dbItems);
    if (isNavDataFilled(navData, breadcrumbs, rootElementCount)) setLandingBannerLoading(false);
  }, [navData]);

  useEffect(() => {
    if (!contentSizeData) return;
    const contentCSSVariables = getCustomCSSVariables("--content");
    const determineActiveState = (width: number) => {
      if (width < contentCSSVariables["--content-sm"]) return stateCollection.maxSm;
      if (width < contentCSSVariables["--content-md"]) return stateCollection.minSm;
      if (width < contentCSSVariables["--content-lg"]) return stateCollection.minMd;
      if (width < contentCSSVariables["--content-xl"]) return stateCollection.minLg;
      return stateCollection.minXl;
    };

    setActiveStates(determineActiveState(contentSizeData.width));
  }, [contentSizeData]);

  return (
    <div id="landing_banner_container" className="flex w-full rounded-2xl border bg-indigo-50">
      <div
        id="landing_banner"
        className={`flex w-full gap-5 p-10 pl-7 text-xl text-indigo-900 ${activeStates.landingBannerDirection}`}
      >
        <div
          id="text_n_buttons"
          className={`flex h-full flex-1 flex-col justify-between gap-5 ${activeStates.textNButtonsOrder}`}
        >
          <div id="text">
            <p>
              <span className="font-bold">Hello! My name is Bulent Gercek.</span> You can find my past and current
              notable works on this personal website. I wish to meet you one day. Happy surfing 🤗
              {/* <span className="text-gray-400">{Math.round(contentSizeData?.width ?? 0)}</span> */}
            </p>
          </div>
          {landingBannerLoading === true ? (
            <Spinner />
          ) : (
            navData &&
            navData.length !== 0 && (
              <div className=" flex flex-row gap-3">
                <Link to={`${navData[1].route}`}>
                  <button
                    className="trans-d500 flex h-[40px] items-center rounded-2xl bg-blue-600 px-5 py-3 text-base 
                font-bold text-indigo-50 hover:px-6"
                  >
                    {`${navData[1].element.name}`}
                  </button>
                </Link>
                <Link to={`${navData[0].route}`}>
                  <button className="trans-d500 flex h-[40px] items-center rounded-2xl bg-purple-600 px-5 py-3 text-base font-bold text-indigo-50 hover:px-6">
                    {`${navData[0].element.name}`}
                  </button>
                </Link>
              </div>
            )
          )}
        </div>
        <div
          id="photo_n_links"
          className={`flex items-center justify-between gap-[10px] ${activeStates.photoNLinksWidth} ${activeStates.photoNLinksDirection} ${activeStates.photoNLinksOrder}`}
        >
          <div>
            <img id="photo" className="w-[175px]" src={bg_photo} alt="bg_logo"></img>
          </div>
          <div id="links" className={`flex items-center justify-center gap-[10px] ${activeStates.linksDirection}`}>
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
