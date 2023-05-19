import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../AppContext";

import bg_logo from "../assets/bg_logo.svg";
import nav_list_switch_close from "../assets/nav_list_switch_close.svg";
import nav_list_switch_open from "../assets/nav_list_switch_open.svg";
import { createStateCollection, createStateData } from "../components/Content";
import { useResizeObserver } from "../hooks/useResizeObserver";
import Content from "../pages/Content";
import Footer from "../pages/Footer";
import Navigation from "../pages/Navigation";

// Page Element States Data
const stateData = createStateData({
  sidebarWidth: {
    w0: "w-0",
    wSidebar: "w-sidebar-open",
  },
  logoAreaWidth: {
    open: "w-logo-area-open",
    close: "w-logo-area-close",
  },
  navListSwitch: {
    close: nav_list_switch_close,
    open: nav_list_switch_open,
  },
  sidebarGap: {
    gap20px: "gap-x-5",
    gap0px: "gap-x-0",
  },
  backgroundFill: {
    bgColorOpacity25: "bg-indigo-500/25 pointer-events-auto",
    bgColorOpacity0: "bg-indigo-500/0 pointer-events-none",
  },
  contentAreaWidth: {
    wPercentMinusSidebar: `w-[calc(100%-var(--sidebar-open-width))]`,
    wFull: "w-full",
  },
});

const stateCollection = createStateCollection(stateData, {
  openStates: {
    sidebarWidth: stateData.sidebarWidth.wSidebar,
    logoAreaWidth: stateData.logoAreaWidth.open,
    navListSwitch: stateData.navListSwitch.close,
    sidebarGap: stateData.sidebarGap.gap20px,
    contentAreaWidth: stateData.contentAreaWidth.wPercentMinusSidebar,
    backgroundFill: "",
  },
  closeStates: {
    sidebarWidth: stateData.sidebarWidth.w0,
    logoAreaWidth: stateData.logoAreaWidth.close,
    navListSwitch: stateData.navListSwitch.open,
    sidebarGap: stateData.sidebarGap.gap0px,
    contentAreaWidth: stateData.contentAreaWidth.wFull,
    backgroundFill: "",
  },
});

/**
 * Base Layout Function Component
 */
const AppLayout: React.FC = () => {
  const [activeStates, setActiveStates] = useState(stateCollection.closeStates);
  const [navToggleOpen, setNavToggleOpen] = useState<boolean>(false);
  const [backgroundFillActive, setBackgroundFillActive] = useState<boolean>(false);
  const [contentRef, contentSizeData] = useResizeObserver<HTMLDivElement>();

  // On Change: navToggleOpen
  useEffect(() => {
    navToggleOpen ? setActiveStates(stateCollection.openStates) : setActiveStates(stateCollection.closeStates);
    setActiveStates((prev) => ({
      ...prev,
      backgroundFill:
        navToggleOpen && backgroundFillActive
          ? stateData.backgroundFill.bgColorOpacity25
          : stateData.backgroundFill.bgColorOpacity0,
    }));
  }, [navToggleOpen]);

  // Media query function and hook for controlling window resize
  const mediaQueryChangeHandler = (currentMql: MediaQueryList) => {
    if (currentMql.matches) {
      setNavToggleOpen(false);
      setBackgroundFillActive(true);
      return;
    }
    // setNavToggleOpen(true);
    setBackgroundFillActive(false);
  };

  // EventListener Change: Media Query
  useEffect(() => {
    const mql: MediaQueryList = window.matchMedia("(width < 1024px)");
    mql.addEventListener("change", () => mediaQueryChangeHandler(mql));
    mediaQueryChangeHandler(mql); // check the current size when the page loads
    return () => mql.removeEventListener("change", () => mediaQueryChangeHandler(mql));
  }, []);

  // Getting AppContext to add our Content resize observer custom hook
  const context = useContext(AppContext);

  return (
    <AppContext.Provider value={{ ...context, contentSizeData }}>
      <div
        id="background_fill"
        className={`fixed top-0 z-10 flex h-screen w-full ${activeStates.backgroundFill} trans-d500 md:bg-indigo-500/0`}
      ></div>
      <div
        id="layout"
        className="trans-d500 p-sm md:p-md relative mx-auto flex min-h-screen max-w-screen-xl flex-col justify-between gap-5"
      >
        <div
          id="logo"
          className={`left-logo-left-sm md:left-logo-left-md top-logo-top-sm md:top-logo-top-md h-logo absolute flex flex-row items-center justify-between ${activeStates.logoAreaWidth} trans-d500 z-30`}
        >
          <Link to="/">
            <img id="bg_logo" className="trans-d200 cursor-pointer hover:scale-105" src={bg_logo} alt="bg_logo"></img>
          </Link>
          <img
            id="nav_list_switch"
            className="trans-d700 cursor-pointer hover:scale-110"
            src={activeStates.navListSwitch}
            onClick={() => {
              setNavToggleOpen(!navToggleOpen);
            }}
            alt="nav_list_switch"
          />
        </div>

        {/* Main Area: Sidebar, Navigation Component, Content Component */}
        <div id="main" className={`relative flex flex-row ${activeStates.sidebarGap} pt-10`}>
          <div
            id="sidebar"
            className={`absolute flex ${activeStates.sidebarWidth} trans-d700 z-20 flex-col overflow-x-hidden md:relative`}
          >
            {/* Navigation Component */}
            <div id="nav" className="w-nav trans-d500 flex flex-col rounded-2xl bg-indigo-50 p-5 pt-10">
              <Navigation />
            </div>
          </div>

          {/* Content Component */}
          <div
            id="content"
            className={`flex-col gap-5 ${
              backgroundFillActive ? stateData.contentAreaWidth.wFull : activeStates.contentAreaWidth
            } trans-d500`}
            ref={contentRef}
          >
            <Content />
          </div>
        </div>

        {/* Footer Area: Footer Component */}
        <div id="footer" className="h-footer flex w-full flex-row items-center gap-5 rounded-2xl bg-indigo-50 p-5">
          <Footer />
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default AppLayout;
