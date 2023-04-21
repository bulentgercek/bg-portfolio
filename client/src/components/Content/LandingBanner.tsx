import React from "react";

const LandingBanner: React.FC = () => {
  return (
    <div id="landing_banner_container" className="flex-none flex-grow-0 self-stretch rounded-2xl border bg-indigo-50">
      <div id="landing_banner" className="flex flex-row items-center p-10 pl-7">
        Hello! My name is Bulent Gercek. You can find my past and current notable works on this personal website. I wish
        to meet you one day. Happy surfing 🤗
      </div>
      <div id="landing_banner_back" className=""></div>
    </div>
  );
};

export default LandingBanner;
