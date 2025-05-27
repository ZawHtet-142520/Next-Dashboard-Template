import { create } from "zustand";
import Cookies from "js-cookie";

interface DashboardState {
  sidebarOpen: boolean;
  mainOpen: boolean;
  setMainOpen: (value: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (value: boolean) => void;
  handleLogout: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  sidebarOpen: true,
  mainOpen: Cookies.get("mainOpen") === "false" ? false : true,
  toggleSidebar: () =>
    set((state) => {
      const newSidebar = !state.sidebarOpen;
      const newMain = !state.mainOpen;
      Cookies.set("mainOpen", String(newMain));
      return {
        sidebarOpen: newSidebar,
        mainOpen: newMain,
      };
    }),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setMainOpen: (open: boolean) => {
    Cookies.set("mainOpen", String(open));
    set({ mainOpen: open });
  },
  handleLogout: () => {
    Cookies.remove("token");
  },
}));
