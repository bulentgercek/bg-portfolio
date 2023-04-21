import React from "react";
import Featured from "../../components/Content/Featured";
import LandingBanner from "../../components/Content/LandingBanner";

const HomeContentLayout: React.FC = () => {
  return (
    <div className="flex w-auto flex-col gap-10">
      {/* Landing Banner Component */}
      <LandingBanner />

      {/* Featured Component */}
      <Featured />
    </div>
  );
};

export default HomeContentLayout;
