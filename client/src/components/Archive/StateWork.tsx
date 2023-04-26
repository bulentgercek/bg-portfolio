import React from "react";

type StateData<K extends string> = {
  [stateDataLabel in K]: {
    [stateData: string]: string;
  };
};

type State<T extends StateData<K>, K extends string> = {
  [stateLabel in keyof T]: keyof T[stateLabel];
};

type StateLibrary<T extends StateData<K>, K extends string> = {
  statesData: T;
  states: {
    [stateName: string]: State<T, K>;
  };
};

const stateLibrary: StateLibrary<
  {
    sidebarWidth: {
      open: string;
      close: string;
    };
    logoAreaWidth: {
      open: string;
      close: string;
    };
  },
  string
> = {
  statesData: {
    sidebarWidth: {
      open: "w-[325px]",
      close: "w-0",
    },
    logoAreaWidth: {
      open: "w-logo-area-open",
      close: "w-logo-area-close",
    },
  },
  states: {
    openStates: {
      sidebarWidth: "open",
      logoAreaWidth: "open",
    },
    closeStates: {
      sidebarWidth: "close",
      logoAreaWidth: "open",
    },
  },
};

const getActualStateValue = <T extends StateData<K>, K extends string, L extends keyof T>(
  stateLib: StateLibrary<T, K>,
  stateName: keyof StateLibrary<T, K>["states"],
  stateLabel: L,
): string => {
  const stateValue = stateLib.states[stateName][stateLabel];
  const stateData = stateLib.statesData[stateLabel];
  if (stateData) {
    return stateData[stateValue as keyof T[L]];
  }
  throw new Error(`State data for ${String(stateLabel)} not found`);
};

// Usage example:
const openSidebarWidth = getActualStateValue(stateLibrary, "openStates", "sidebarWidth");
const closeSidebarWidth = getActualStateValue(stateLibrary, "closeStates", "sidebarWidth");
const openLogoAreaWidth = getActualStateValue(stateLibrary, "openStates", "logoAreaWidth");
const closeLogoAreaWidth = getActualStateValue(stateLibrary, "closeStates", "logoAreaWidth");

const StateWork: React.FC = () => {
  const sidebarWidthState = stateLibrary.states.openStates.sidebarWidth;
  console.log(stateLibrary.statesData.sidebarWidth[sidebarWidthState]);
  return (
    <div>
      <div>{openSidebarWidth}</div>
      <div>{closeSidebarWidth}</div>
      <div>{openLogoAreaWidth}</div>
      <div>{closeLogoAreaWidth}</div>
    </div>
  );
};

export default StateWork;
