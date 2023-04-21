import React, { useContext } from "react";
import AppContext from "../AppContext";
import HomeContentLayout from "../layouts/Content/HomeContentLayout";

const Content: React.FC = () => {
  const context = useContext(AppContext);
  const { breadcrumbs } = context;

  return <>{<HomeContentLayout />}</>;
  // return <>{breadcrumbs.length === 0 && <HomeContentLayout />}</>;
};

export default Content;
