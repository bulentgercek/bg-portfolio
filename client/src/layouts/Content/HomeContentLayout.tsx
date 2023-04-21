import React from "react";

const HomeContentLayout: React.FC = () => {
  return (
    <div className="flex w-auto flex-col gap-10">
      {/* Landing Banner Component */}
      <div id="landing_banner_container" className="flex-none flex-grow-0 self-stretch rounded-2xl border bg-indigo-50">
        <div id="landing_banner" className="flex flex-row items-center p-10 pl-7">
          Hello! My name is Bulent Gercek. You can find my past and current notable works on this personal website. I
          wish to meet you one day. Happy surfing 🤗
        </div>
        <div id="landing_banner_back" className=""></div>
      </div>

      {/* Featured Component */}
      <div id="featured" className="flex flex-col items-start rounded-2xl bg-blue-200 p-5 pt-2.5">
        <div id="header" className="h-6 w-full text-center font-semibold text-blue-800">
          Featured Works
        </div>
        <div id="item_container" className="flex h-[350px] w-full flex-row gap-5">
          <div className="w-1/3 rounded-2xl bg-indigo-50/50 "></div>
          <div className="w-1/3 rounded-2xl bg-indigo-50/50"></div>
          <div className="w-1/3 rounded-2xl bg-indigo-50/50"></div>
        </div>
      </div>
    </div>
  );
};

export default HomeContentLayout;
