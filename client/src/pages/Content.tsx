import React, { useContext } from "react";
import AppContext from "../AppContext";
import HomeContentLayout from "../layouts/Content/HomeContentLayout";

const Content: React.FC = () => {
  const context = useContext(AppContext);
  const { routeData } = context;

  return <>{!routeData.cid && !routeData.iid && <HomeContentLayout />}</>;
};

export default Content;
