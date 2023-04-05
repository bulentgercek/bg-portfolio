import React, { useEffect, useState } from "react";

import bg_logo from "../assets/bg_logo.svg";
import nav_list_switch_close from "../assets/nav_list_switch_close.svg";
import nav_list_switch_open from "../assets/nav_list_switch_open.svg";
import Content from "./Content";
import Footer from "./Footer";
import Navigation from "./Navigation";
import { LayoutProps, StatesDataType, StatesFuseboxType, StatesType } from ".";

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
const states: StatesType = {
  sidebarWidth: statesData.sidebarWidth.w325px,
  logoAreaWidth: statesData.logoAreaWidth.w285px,
  navListSwitch: statesData.navListSwitch.close,
  sidebarVisibilty: statesData.sidebarVisibilty.flex,
  sidebarGap: statesData.sidebarGap.gap20px,
};

// Assign State Defaults like a fusebox
const statesFusebox: StatesFuseboxType = {
  isWindowResizedDown: false,
  isNavToggleOpen: true,
};

const Layout: React.FC<LayoutProps> = ({ value }) => {
  const [statesUpdate, setStatesUpdate] = useState(false);

  // Page Element State Handler
  const pageElementsHandler = (
    fusebox: typeof statesFusebox,
    states: StatesType,
  ) => {
    if (!statesUpdate) return;
    if (!fusebox.isNavToggleOpen || fusebox.isWindowResizedDown) {
      states.sidebarWidth = statesData.sidebarWidth.w0px;
      states.logoAreaWidth = statesData.logoAreaWidth.w124px;
      states.navListSwitch = statesData.navListSwitch.open;
      // states.sidebarVisibilty = statesData.sidebarVisibilty.hidden;
      states.sidebarGap = statesData.sidebarGap.gap0px;
    } else {
      states.sidebarWidth = statesData.sidebarWidth.w325px;
      states.logoAreaWidth = statesData.logoAreaWidth.w285px;
      states.navListSwitch = statesData.navListSwitch.close;
      // states.sidebarVisibilty = statesData.sidebarVisibilty.flex;
      states.sidebarGap = statesData.sidebarGap.gap20px;
    }
    console.log(fusebox);
    console.log(states);
  };

  useEffect(() => {
    pageElementsHandler(statesFusebox, states);
    setStatesUpdate(false);
  }, [statesUpdate]);

  const mql = window.matchMedia("(min-width: 768px)");
  mql.addEventListener("change", (event: MediaQueryListEvent) => {
    if (event.matches) {
      setStatesUpdate(() => {
        statesFusebox.isWindowResizedDown = false;
        return !statesUpdate;
      });
    } else {
      setStatesUpdate(() => {
        statesFusebox.isWindowResizedDown = true;
        return !statesUpdate;
      });
    }
  });

  return (
    <div
      id="layout"
      className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-between gap-5 p-10"
    >
      <div
        id="logo"
        className={`absolute left-[60px] top-[40px] flex h-[64px] flex-row items-center justify-between ${states.logoAreaWidth} transition-all  duration-500 ease-out`}
      >
        <img src={bg_logo}></img>
        <img
          className="cursor-pointer"
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
        className={`flex w-full flex-row items-start ${states.sidebarGap} pt-10 transition-all duration-700 ease-out`}
      >
        <div
          id="sidebar"
          className={`${states.sidebarVisibilty} ${states.sidebarWidth} flex-col items-start overflow-x-hidden rounded-2xl transition-all duration-700 ease-out`}
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
