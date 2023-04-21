import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import bg_logo from "../assets/bg_logo.svg";
import nav_list_switch_close from "../assets/nav_list_switch_close.svg";
import nav_list_switch_open from "../assets/nav_list_switch_open.svg";
import { StatesData, States } from "../pages";
import Content from "../pages/Content";
import Footer from "../pages/Footer";
import Navigation from "../pages/Navigation";

// Page Element States Data
const statesData: StatesData = {
  sidebarWidth: {
    w0px: "w-0",
    w325px: "w-[325px]",
  },
  sidebarOverflowX: {
    hidden: "overflow-x-hidden",
    visible: "overflow-x-visible",
  },
  logoAreaWidth: {
    w285px: "w-[285px]",
    w124px: "w-[124px]",
  },
  navListSwitch: {
    close: nav_list_switch_close,
    open: nav_list_switch_open,
  },
  sidebarGap: {
    gap20px: "gap-x-[20px]",
    gap0px: "gap-x-[0px]",
  },
  sidebarVisibilty: {
    flex: "flex",
    hidden: "hidden",
  },
  backgroundFill: {
    bgColorOpacity25: "bg-indigo-500/25",
    bgColorOpacity0: "bg-indigo-500/0",
  },
};

// Assign Page Element Default States from States Data
// Page Elements Open States
const openStates: States = {
  sidebarWidth: statesData.sidebarWidth.w325px,
  sidebarOverflowX: statesData.sidebarOverflowX.visible,
  logoAreaWidth: statesData.logoAreaWidth.w285px,
  navListSwitch: statesData.navListSwitch.close,
  sidebarVisibilty: statesData.sidebarVisibilty.flex,
  sidebarGap: statesData.sidebarGap.gap20px,
};
// Page Elements Close States
const closeStates: States = {
  sidebarWidth: statesData.sidebarWidth.w0px,
  sidebarOverflowX: statesData.sidebarOverflowX.hidden,
  logoAreaWidth: statesData.logoAreaWidth.w124px,
  navListSwitch: statesData.navListSwitch.open,
  sidebarGap: statesData.sidebarGap.gap0px,
};

/**
 * Base Layout Function Component
 */
const Layout: React.FC = () => {
  const [states, setStates] = useState<States>(closeStates);
  const [navToggleOpen, setNavToggleOpen] = useState<boolean>(true);
  const [backgroundFillActive, setBackgroundFillActive] = useState<boolean>(false);

  // On Change: navToggleOpen
  useEffect(() => {
    navToggleOpen ? setStates(openStates) : setStates(closeStates);
    navToggleOpen && backgroundFillActive
      ? setStates((prev) => ({
          ...prev,
          backgroundFill: statesData.backgroundFill.bgColorOpacity25,
        }))
      : setStates((prev) => ({
          ...prev,
          backgroundFill: statesData.backgroundFill.bgColorOpacity0,
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
  };

  // EventListener Change: Media Query
  useEffect(() => {
    const mql: MediaQueryList = window.matchMedia("(width < 768px)");
    mql.addEventListener("change", () => mediaQueryChangeHandler(mql));
    mediaQueryChangeHandler(mql); // check the current size when the page loads
    return () => mql.removeEventListener("change", () => mediaQueryChangeHandler(mql));
  }, []);

  return (
    <>
      <div
        id="background_fill"
        className={`fixed top-0 z-10 flex h-screen w-full ${states.backgroundFill} transition-all duration-500 ease-out sm:bg-indigo-500/0`}
      ></div>
      <div
        id="layout"
        className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-between gap-5 p-[30px] transition-all duration-500 ease-out sm:p-10"
      >
        <div
          id="logo"
          className={`absolute left-[50px] top-[30px] flex h-[64px] flex-row items-center justify-between sm:left-[60px] sm:top-[40px] ${states.logoAreaWidth} z-30 transition-all duration-500 ease-out`}
        >
          <Link to="/">
            <img id="bg_logo" className="cursor-pointer transition-transform hover:scale-105" src={bg_logo}></img>
          </Link>
          <img
            id="nav_list_switch"
            className="duration-250 cursor-pointer transition-all ease-out hover:scale-110"
            src={states.navListSwitch}
            onClick={() => {
              setNavToggleOpen(!navToggleOpen);
            }}
          />
        </div>

        {/* Main Area: Sidebar, Navigation Component, Content Component */}
        <div
          id="main"
          className={`relative flex w-full flex-row items-start ${states.sidebarGap} pt-10 transition-all duration-700 ease-out`}
        >
          <div
            id="sidebar"
            className={`${states.sidebarVisibilty} ${states.sidebarWidth} ${states.sidebarOverflowX} absolute z-20 flex-col items-start rounded-2xl transition-all duration-700 ease-out sm:relative`}
          >
            {/* Navigation Component */}
            <div id="nav" className="item-start flex w-[325px] flex-col rounded-2xl bg-indigo-50 p-5 pt-10">
              <Navigation />
            </div>
          </div>

          {/* Content Component */}
          <div id="content" className="flex-col items-start gap-5">
            <Content />
          </div>
        </div>

        {/* Footer Area: Footer Component */}
        <div id="footer" className="flex h-[112px] w-full flex-row items-center gap-5 rounded-2xl bg-indigo-50 p-5">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
