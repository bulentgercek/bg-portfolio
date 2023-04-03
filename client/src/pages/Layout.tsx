import React, { useEffect, useState } from "react";

import bg_logo from "../assets/bg_logo.svg";
import nav_list_switch_close from "../assets/nav_list_switch_close.svg";
import nav_list_switch_open from "../assets/nav_list_switch_open.svg";
import Content from "./Content";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

interface LayoutProps {
  value: string;
}

const Layout: React.FC<LayoutProps> = ({ value }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(true);
      } else {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      id="layout"
      className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-between gap-5 p-10"
    >
      <div
        id="logo"
        className="xs:w-[129px] xs:gap-[15px] absolute left-[60px] top-[40px] flex 
        h-[64px] flex-row items-center sm:w-[281px] sm:gap-[167px]"
      >
        <img src={bg_logo}></img>
        <img src={isMenuOpen ? nav_list_switch_close : nav_list_switch_open} />
      </div>

      <div id="main" className="flex w-full flex-row items-start gap-5 pt-10">
        {isMenuOpen && (
          <div id="sidebar" className="flex w-[325px] flex-col items-start">
            <div
              id="nav"
              className="item-start flex w-[325px] flex-col gap-[10px] rounded-2xl bg-indigo-50 p-5 pt-10"
            >
              <Sidebar value="home" />
            </div>
          </div>
        )}

        <div id="content" className="flex w-full flex-col items-start gap-5">
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
