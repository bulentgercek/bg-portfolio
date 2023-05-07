import React, { useContext, useEffect, useState } from "react";

import bg_photo from "../assets/bg_photo.png";
import bg_logo from "../assets/bg_logo.svg";
import go_top from "../assets/go_top.svg";
import AppContext from "../AppContext";
import { Link } from "react-router-dom";
import { createNavElementKey } from "../utils/navigationUtils";
import { createStateCollection, createStateData } from "../components/Content";

// Window Sizes
const windowSizeVariables = {
  "--window-lg": 895,
  "--window-md": 560,
  "--window-sm": 480,
};

const stateData = createStateData({
  footerLogoNText: {
    minW225: "min-w-[225px]",
    noMinW: "",
  },
  footerIdentity: {
    visible: "visible",
    hidden: "hidden",
  },
  bgLogoNText: {
    visible: "visible",
    hidden: "hidden",
  },
  rootLinks: {
    visible: "visible",
    hidden: "hidden",
  },
});

const stateCollection = createStateCollection(stateData, {
  minLg: {
    footerLogoNText: stateData.footerLogoNText.minW225,
    footerIdentity: stateData.footerIdentity.visible,
    bgLogoNText: stateData.bgLogoNText.visible,
    rootLinks: stateData.rootLinks.visible,
  },
  minMd: {
    footerLogoNText: stateData.footerLogoNText.minW225,
    footerIdentity: stateData.footerIdentity.visible,
    bgLogoNText: stateData.bgLogoNText.hidden,
    rootLinks: stateData.rootLinks.visible,
  },
  minSm: {
    footerLogoNText: stateData.footerLogoNText.noMinW,
    footerIdentity: stateData.footerIdentity.hidden,
    bgLogoNText: stateData.bgLogoNText.hidden,
    rootLinks: stateData.rootLinks.visible,
  },
  maxSm: {
    footerLogoNText: stateData.footerLogoNText.noMinW,
    footerIdentity: stateData.footerIdentity.hidden,
    bgLogoNText: stateData.bgLogoNText.hidden,
    rootLinks: stateData.rootLinks.hidden,
  },
});

const Footer: React.FC = () => {
  const { navData } = useContext(AppContext);
  const [activeStates, setActiveStates] = useState(stateCollection.maxSm);

  useEffect(() => {
    const determineActiveState = (width: number) => {
      if (width < windowSizeVariables["--window-sm"]) return stateCollection.maxSm;
      if (width < windowSizeVariables["--window-md"]) return stateCollection.minSm;
      if (width < windowSizeVariables["--window-lg"]) return stateCollection.minMd;
      return stateCollection.minLg;
    };

    setActiveStates(determineActiveState(window.innerWidth));
  }, [window.innerWidth]);

  return (
    <div className="flex w-full flex-row justify-between gap-5">
      <div
        id="footer_photo_n_identity"
        className={`flex max-w-[300px] flex-row items-center gap-5 ${activeStates.footerLogoNText}`}
      >
        <img src={bg_photo} alt="bg_photo" className="h-[72px] w-[72px]"></img>
        <span id="footer_identity" className={`font-medium text-blue-600 ${activeStates.footerIdentity}`}>
          bulentgercek.com @ 2023
        </span>
      </div>
      <div id="bg_logo_n_text" className={`flex flex-row items-center gap-10 ${activeStates.bgLogoNText}`}>
        <img src={bg_logo} alt="bg_logo" className="h-[72px] w-[72px]"></img>
        <div className="text-indigo-500">
          <span className="font-medium">This site has been designed and developed as a </span>
          <a href="https://github.com/bulentgercek/bg-portfolio" target="_blank">
            <span className="font-bold underline">full stack project.</span>
          </a>
        </div>
      </div>
      <div id="root_links" className={`flex flex-row items-center gap-5 font-bold ${activeStates.rootLinks}`}>
        {navData &&
          navData.map((element) => (
            <Link key={createNavElementKey(element)} to={element.route}>
              <div className="font-bold text-blue-600">{element.element.name}</div>
            </Link>
          ))}
      </div>
      <div id="go_top" className="flex items-center">
        <img src={go_top} alt="go_top" className="h-[50px] w-[50px]"></img>
      </div>
    </div>
  );
};

export default Footer;
