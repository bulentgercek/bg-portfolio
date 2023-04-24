import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../AppContext";

import bg_logo from "../assets/bg_logo.svg";
import nav_list_switch_close from "../assets/nav_list_switch_close.svg";
import nav_list_switch_open from "../assets/nav_list_switch_open.svg";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { StatesData, States } from "../pages";
import Content from "../pages/Content";
import Footer from "../pages/Footer";
import Navigation from "../pages/Navigation";

// Page Element States Data
const statesData: StatesData = {
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
    bgColorOpacity25: "bg-indigo-500/25",
    bgColorOpacity0: "bg-indigo-500/0",
  },
  contentAreaWidth: {
    wPercentMinusSidebar: `w-[calc(100%-var(--sidebar-open-width))]`,
    wFull: "w-full",
  },
};

// Assign Page Element Default States from States Data
// Page Elements Open States
const openStates: States = {
  sidebarWidth: statesData.sidebarWidth.wSidebar,
  logoAreaWidth: statesData.logoAreaWidth.open,
  navListSwitch: statesData.navListSwitch.close,
  sidebarGap: statesData.sidebarGap.gap20px,
  contentAreaWidth: statesData.contentAreaWidth.wPercentMinusSidebar,
};
// Page Elements Close States
const closeStates: States = {
  sidebarWidth: statesData.sidebarWidth.w0,
  logoAreaWidth: statesData.logoAreaWidth.close,
  navListSwitch: statesData.navListSwitch.open,
  sidebarGap: statesData.sidebarGap.gap0px,
  contentAreaWidth: statesData.contentAreaWidth.wFull,
};

/**
 * Base Layout Function Component
 */
const AppLayout: React.FC = () => {
  const [states, setStates] = useState<States>(closeStates);
  const [navToggleOpen, setNavToggleOpen] = useState<boolean>(true);
  const [backgroundFillActive, setBackgroundFillActive] = useState<boolean>(false);
  const [contentRef, contentSizeData] = useResizeObserver<HTMLDivElement>();

  // On Change: navToggleOpen
  useEffect(() => {
    navToggleOpen ? setStates(openStates) : setStates(closeStates);
    setStates((prev) => ({
      ...prev,
      backgroundFill:
        navToggleOpen && backgroundFillActive
          ? statesData.backgroundFill.bgColorOpacity25
          : statesData.backgroundFill.bgColorOpacity0,
    }));
  }, [navToggleOpen]);

  // Media query function and hook for controlling window resize
  const mediaQueryChangeHandler = (currentMql: MediaQueryList) => {
    if (currentMql.matches) {
      setNavToggleOpen(false);
      setBackgroundFillActive(true);
      return;
    }
    setNavToggleOpen(true);
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
        className={`fixed top-0 z-10 flex h-screen w-full ${states.backgroundFill} transition-all duration-500 ease-out md:bg-indigo-500/0`}
      ></div>
      <div
        id="layout"
        className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-between gap-5 p-[30px] transition-all duration-500 ease-out md:p-10"
      >
        <div
          id="logo"
          className={`absolute left-[50px] top-[30px] flex h-[64px] flex-row items-center justify-between md:left-[60px] md:top-[40px] ${states.logoAreaWidth} z-30 transition-all duration-500 ease-out`}
        >
          <Link to="/">
            <img
              id="bg_logo"
              className="cursor-pointer transition-transform hover:scale-105"
              src={bg_logo}
              alt="bg_logo"
            ></img>
          </Link>
          <img
            id="nav_list_switch"
            className="duration-250 cursor-pointer transition-all ease-out hover:scale-110"
            src={states.navListSwitch}
            onClick={() => {
              setNavToggleOpen(!navToggleOpen);
            }}
            alt="nav_list_switch"
          />
        </div>

        {/* Main Area: Sidebar, Navigation Component, Content Component */}
        <div
          id="main"
          className={`relative flex w-full flex-row items-start ${states.sidebarGap} pt-10 transition-all duration-700 ease-out`}
        >
          <div
            id="sidebar"
            className={`absolute flex ${states.sidebarWidth} z-20 flex-col items-start overflow-x-hidden rounded-2xl transition-all duration-700 ease-out md:relative`}
          >
            {/* Navigation Component */}
            <div id="nav" className="item-start w-nav flex flex-col rounded-2xl bg-indigo-50 p-5 pt-10">
              <Navigation />
            </div>
          </div>

          {/* Content Component */}
          <div
            id="content"
            className={`flex-col items-start gap-5 ${
              backgroundFillActive ? statesData.contentAreaWidth.wFull : states.contentAreaWidth
            } transition-all duration-700 ease-out`}
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
