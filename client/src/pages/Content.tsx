import React, { useContext } from "react";
import AppContext from "../AppContext";
import CategoryContentLayout from "../layouts/Content/CategoryContentLayout";
import HomeContentLayout from "../layouts/Content/HomeContentLayout";
import ItemContentLayout from "../layouts/Content/ItemContentLayout";

const Content: React.FC = () => {
  const context = useContext(AppContext);
  const { routeData } = context;

  return (
    <>
      {!routeData.cid && !routeData.iid && <HomeContentLayout />}
      {routeData.cid && !routeData.iid && <CategoryContentLayout />}
      {routeData.cid && routeData.iid && <ItemContentLayout />}
      {!routeData.cid && routeData.iid && <ItemContentLayout />}
    </>
  );
};

export default Content;
