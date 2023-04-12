import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import bg_logo from "../assets/bg_logo.svg";
import nav_list_switch_close from "../assets/nav_list_switch_close.svg";
import nav_list_switch_open from "../assets/nav_list_switch_open.svg";
import Content from "./Content";
import Footer from "./Footer";
import Navigation from "./Navigation";
import { LayoutProps, StatesDataType, StatesType } from ".";

// Page Element States Data
const statesData: StatesDataType = {
  sidebarWidth: {
    w0px: "w-0",
    w325px: "w-[325px]",
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
const openStates: StatesType = {
  sidebarWidth: statesData.sidebarWidth.w325px,
  logoAreaWidth: statesData.logoAreaWidth.w285px,
  navListSwitch: statesData.navListSwitch.close,
  sidebarVisibilty: statesData.sidebarVisibilty.flex,
  sidebarGap: statesData.sidebarGap.gap20px,
};
// Page Elements Close States
const closeStates: StatesType = {
  sidebarWidth: statesData.sidebarWidth.w0px,
  logoAreaWidth: statesData.logoAreaWidth.w124px,
  navListSwitch: statesData.navListSwitch.open,
  sidebarGap: statesData.sidebarGap.gap0px,
};

const Layout: React.FC<LayoutProps> = ({ value }) => {
  const [states, setStates] = useState<StatesType>(closeStates);
  const [navToggleOpen, setNavToggleOpen] = useState<boolean>(true);
  const [backgroundFillActive, setBackgroundFillActive] =
    useState<boolean>(false);

  // Navigation variables and functions
  const location = useLocation();

  const navigateToHome = () => {
    // if we are not at the home page navigate it
    if (location.pathname !== "/") return <Navigate to="/" />;
  };

  // Hook for re-rendering element states using the navigation toggle
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

  useEffect(() => {
    const mql: MediaQueryList = window.matchMedia("(width < 768px)");
    mql.addEventListener("change", () => mediaQueryChangeHandler(mql));
    mediaQueryChangeHandler(mql); // check the current size when the page loads
    return () =>
      mql.removeEventListener("change", () => mediaQueryChangeHandler(mql));
  }, []);

  return (
    <>
      <div
        id="background_fill"
        className={`fixed top-0 z-10 flex h-screen w-full ${states.backgroundFill} transition-all duration-500 ease-out sm:bg-indigo-500/0`}
      ></div>
      <div
        id="layout"
        className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-between gap-5 p-10"
      >
        <div
          id="logo"
          className={`absolute left-[60px] top-[40px] flex h-[64px] flex-row items-center justify-between ${states.logoAreaWidth} z-30 transition-all duration-500 ease-out`}
        >
          <img
            id="bg_logo"
            className="cursor-pointer transition-transform hover:scale-105"
            src={bg_logo}
            onClick={navigateToHome}
          ></img>
          <img
            id="nav_list_switch"
            className="duration-250 cursor-pointer transition-all ease-out hover:scale-110"
            src={states.navListSwitch}
            onClick={() => {
              setNavToggleOpen(!navToggleOpen);
            }}
          />
        </div>

        {/* Main Area : Sidebar, Navigation, Content */}
        <div
          id="main"
          className={`relative flex w-full flex-row items-start ${states.sidebarGap} pt-10 transition-all duration-700 ease-out`}
        >
          <div
            id="sidebar"
            className={`${states.sidebarVisibilty} ${states.sidebarWidth} absolute z-20 flex-col items-start overflow-x-hidden rounded-2xl transition-all duration-700 ease-out sm:relative`}
          >
            <div
              id="nav"
              className="item-start flex w-[325px] flex-col gap-[10px] rounded-2xl bg-indigo-50 p-5 pt-10"
            >
              <Navigation value="home" />
            </div>
          </div>

          <div
            id="content"
            className="flex-grow flex-col items-start gap-5 rounded-2xl bg-indigo-50/50 p-5 pt-10"
          >
            <Content value="home" />
          </div>
        </div>

        {/* Footer Area */}
        <div
          id="footer"
          className="flex h-[112px] w-full flex-row items-center gap-5 rounded-2xl bg-indigo-50 p-5"
        >
          <Footer value="home" />
        </div>
      </div>
    </>
  );
};

export default Layout;
