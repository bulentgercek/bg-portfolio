import React, { useEffect, useState } from "react";

import bg_logo from "../assets/bg_logo.svg";
import nav_list_switch_close from "../assets/nav_list_switch_close.svg";
import nav_list_switch_open from "../assets/nav_list_switch_open.svg";
import Content from "./Content";
import Footer from "./Footer";
import Navigation from "./Navigation";
import { LayoutProps, StatesDataType, StatesFuseboxType, StatesType } from ".";
import { Navigate, useLocation } from "react-router-dom";

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
};

// Assign Page Element Default States from States Data
// Page Elements Open States
const statesOpen: StatesType = {
  sidebarWidth: statesData.sidebarWidth.w325px,
  logoAreaWidth: statesData.logoAreaWidth.w285px,
  navListSwitch: statesData.navListSwitch.close,
  sidebarVisibilty: statesData.sidebarVisibilty.flex,
  sidebarGap: statesData.sidebarGap.gap20px,
};
// Page Elements Close States
const statesClose: StatesType = {
  sidebarWidth: statesData.sidebarWidth.w0px,
  logoAreaWidth: statesData.logoAreaWidth.w124px,
  navListSwitch: statesData.navListSwitch.open,
  sidebarGap: statesData.sidebarGap.gap0px,
};
// Page Elements Main States
const states: StatesType = { ...statesOpen };

// Assign State Defaults like a fusebox
const statesFusebox: StatesFuseboxType = {
  isNavTempModeActive: false,
  isNavToggleOpen: true,
};

const Layout: React.FC<LayoutProps> = ({ value }) => {
  const [statesUpdate, setStatesUpdate] = useState(false);

  // Get current location from router
  const location = useLocation();

  // Navigation constants
  const navigateToHome = () => {
    if (location.pathname === "/") {
      // Do nothing if already on the home page
      return;
    }
    return <Navigate to="/" />;
  };

  // Page Element State Handler
  const pageElementsHandler = (
    fusebox: StatesFuseboxType,
    states: StatesType,
  ) => {
    if (!statesUpdate) return;

    if (fusebox.isNavToggleOpen) {
      Object.assign(states, statesOpen);
      setStatesUpdate(!statesUpdate);
    } else {
      Object.assign(states, statesClose);
      setStatesUpdate(!statesUpdate);
    }
  };

  useEffect(() => {
    pageElementsHandler(statesFusebox, states);
    setStatesUpdate(false);
  }, [statesUpdate]);

  const mediaQueryChangeHandler = (event: MediaQueryListEvent) => {
    if (event.matches) {
      // if windows size > then 768
      setStatesUpdate(() => {
        // If windows resized up that first check if navigation temp active
        // so open navigation and deactivate navigation temp mode
        if (statesFusebox.isNavTempModeActive) {
          statesFusebox.isNavToggleOpen = true;
          statesFusebox.isNavTempModeActive = false;
        }
        return !statesUpdate;
      });
    } else {
      // if windows size < then 768
      setStatesUpdate(() => {
        // If windows resized down, first check if navigation open
        // if it is then close navigation and activate navigation temp mode
        if (statesFusebox.isNavToggleOpen) {
          statesFusebox.isNavToggleOpen = false;
          statesFusebox.isNavTempModeActive = true;
        }
        return !statesUpdate;
      });
    }
  };

  useEffect(() => {
    const mql: MediaQueryList = window.matchMedia("(width > 768px)");
    mql.addEventListener("change", mediaQueryChangeHandler);
    return () => mql.removeEventListener("change", mediaQueryChangeHandler);
  }, []);

  return (
    <div
      id="layout"
      className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-between gap-5 p-10"
    >
      <div
        id="logo"
        className={`absolute left-[60px] top-[40px] flex h-[64px] flex-row items-center justify-between ${states.logoAreaWidth} z-10 transition-all duration-500 ease-out`}
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
          onClick={() =>
            setStatesUpdate(() => {
              statesFusebox.isNavToggleOpen = !statesFusebox.isNavToggleOpen;
              return !statesUpdate;
            })
          }
        />
      </div>

      <div
        id="main"
        className={`relative flex w-full flex-row items-start ${states.sidebarGap} pt-10 transition-all duration-700 ease-out`}
      >
        <div
          id="sidebar"
          className={`${states.sidebarVisibilty} ${states.sidebarWidth} absolute flex-col items-start overflow-x-hidden rounded-2xl transition-all duration-700 ease-out sm:relative`}
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

      <div
        id="footer"
        className="flex h-[112px] w-full flex-row items-center gap-5 rounded-2xl bg-indigo-50 p-5"
      >
        <Footer value="home" />
      </div>
    </div>
  );
};

export default Layout;
