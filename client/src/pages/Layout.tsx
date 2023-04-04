import React, { useEffect, useState } from "react";

import bg_logo from "../assets/bg_logo.svg";
import nav_list_switch_close from "../assets/nav_list_switch_close.svg";
import nav_list_switch_open from "../assets/nav_list_switch_open.svg";
import Content from "./Content";
import Footer from "./Footer";
import Navigation from "./Navigation";

interface LayoutProps {
  value: string;
}

const Layout: React.FC<LayoutProps> = ({ value }) => {
  const [sidebarToggle, setSidebarToogle] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState("w-[325px]");
  const [sidebarGap, setSidebarGap] = useState("gap-x-[20px]");
  const [logoAreaWidth, setLogoAreaWidth] = useState("w-[285px]");
  const [sidebarVisibilty, setSidebarVisibilty] = useState("flex");
  const [navListSwitch, setNavListSwitch] = useState(nav_list_switch_open);

  const changePageVariables = (state: boolean) => {
    if (state) {
      setLogoAreaWidth("w-[285px]");
      setNavListSwitch(nav_list_switch_close);
      setSidebarVisibilty("flex");
      setSidebarWidth("w-[325px]");
      setSidebarGap("gap-x-[20px]");
    } else {
      setLogoAreaWidth("w-[124px]");
      setNavListSwitch(nav_list_switch_open);
      setSidebarWidth("w-0");
      setSidebarGap("gap-x-[0px]");
    }
  };

  useEffect(() => {
    changePageVariables(sidebarToggle);
  }, [sidebarToggle]);

  const mql = window.matchMedia("(min-width: 768px)");
  mql.addEventListener("change", (event: MediaQueryListEvent) => {
    if (sidebarToggle && event.matches) {
      changePageVariables(true);
      return;
    }
    changePageVariables(false);
  });

  return (
    <div
      id="layout"
      className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-between gap-5 p-10"
    >
      <div
        id="logo"
        className={`absolute left-[60px] top-[40px] flex h-[64px] flex-row items-center justify-between ${logoAreaWidth} transition-all  duration-500 ease-out`}
      >
        <img src={bg_logo}></img>
        <img
          className="cursor-pointer"
          src={navListSwitch}
          onClick={() => setSidebarToogle(!sidebarToggle)}
        />
      </div>

      <div
        id="main"
        className={`flex w-full flex-row items-start ${sidebarGap} pt-10 transition-all duration-700 ease-out`}
      >
        <div
          id="sidebar"
          className={`${sidebarVisibilty} ${sidebarWidth} flex-col items-start overflow-x-hidden rounded-2xl transition-all duration-700 ease-out`}
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
