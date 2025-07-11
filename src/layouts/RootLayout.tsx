import React, { createContext, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import { ToastContainer } from "react-toastify";
import { useSidebarPin } from "../hooks/useSidebarPin";
export const GlobalContext = createContext({});

const RootLayout: React.FC = () => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [isSidebarPinned, togglePin] = useSidebarPin();

  const globalStates = {
    modalVisibility,
    setModalVisibility,
  };
  return (
    <GlobalContext.Provider value={globalStates}>
        <ToastContainer />
        <div className="layout-wrapper">
        <div className="flex">
          <Sidebar isSidebarPinned={isSidebarPinned} togglePin={togglePin} />
          <main className={`bg-[#E6E6E8] dark:bg-[#111826] shadow-md main-content p-[8px] min-h-screen  dark w-full  ${isSidebarPinned && 'pl-[75px]'} transition-all duration-300`}>
            <Header />
            {/* =============== BreadCrumb ========= */}
             
            <Outlet />
          </main>
        </div>
      </div>
    </GlobalContext.Provider>
  );
};

export default RootLayout;
