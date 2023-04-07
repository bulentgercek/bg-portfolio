/**
 * Layout
 * Interfaces, Types
 */
export interface LayoutProps {
  value: string;
}

export type StatesType = {
  sidebarWidth: string;
  logoAreaWidth: string;
  navListSwitch: string;
  sidebarGap: string;
  sidebarVisibilty?: string;
};

export type StatesDataType = {
  sidebarWidth: {
    w0px: string;
    w325px: string;
  };
  logoAreaWidth: {
    w285px: string;
    w124px: string;
  };
  navListSwitch: {
    close: string;
    open: string;
  };
  sidebarGap: {
    gap20px: string;
    gap0px: string;
  };
  sidebarVisibilty: {
    flex: string;
    hidden: string;
  };
};

export type StatesFuseboxType = {
  isWindowResizedDown: boolean;
  isNavToggleOpen: boolean;
  isNavToggleOpenTemp: boolean;
};
