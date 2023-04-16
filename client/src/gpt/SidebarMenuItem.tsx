import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import data from "./menu-data.json";

interface MenuItem {
  name: string;
  url: string;
  children: MenuItem[];
}

const SidebarMenuItem: React.FC<{
  menuItem: MenuItem;
}> = ({ menuItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasChildren = menuItem.children && menuItem.children.length > 0;
  const isCurrentPath = location.pathname === menuItem.url;
  const isAncestorPath = location.pathname.includes(menuItem.url) && hasChildren;

  useEffect(() => {
    if (isCurrentPath || isAncestorPath) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isCurrentPath, isAncestorPath]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <li className="relative">
        <NavLink
          to={menuItem.url}
          onClick={toggleMenu}
          className="block py-2 pl-3 pr-4 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
        >
          {menuItem.name}
        </NavLink>
        {hasChildren && (
          <button onClick={toggleMenu} className="absolute right-0 top-0">
            {isOpen ? "-" : ">"}
          </button>
        )}
      </li>
      {hasChildren && isOpen && (
        <ul className="pl-4">
          {menuItem.children.map((child) => (
            <SidebarMenuItem key={child.name} menuItem={child} />
          ))}
        </ul>
      )}
    </>
  );
};

const SidebarMenu: React.FC = () => {
  return (
    <ul className="flex w-[325px] flex-col">
      {data.map((menuItem) => (
        <SidebarMenuItem key={menuItem.name} menuItem={menuItem} />
      ))}
    </ul>
  );
};

export default SidebarMenu;
