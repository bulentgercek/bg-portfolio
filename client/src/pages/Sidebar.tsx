import React from "react";

interface SidebarProps {
  value: string;
}

const Sidebar: React.FC<SidebarProps> = ({ value }) => {
  return <h1>Sidebar</h1>;
};

export default Sidebar;
