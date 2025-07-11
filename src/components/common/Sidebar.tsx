import { NavLink } from "react-router-dom";
// import { useTheming } from "../../hooks/useTheming";
import { useState } from "react";
import { menuBar } from "../../static-data/sidebar-menu";
import bullet from "../../assets/icons/sidebar/bullet.svg";
import {  ChevronRight, Dot } from "lucide-react";

interface SidebarProps {
  isSidebarPinned: boolean;
  togglePin: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarPinned, togglePin }) => {
  const [openedLvlOne, setOpenedLvlOne] = useState<string | null>(null);
  const [openedLvlTwo, setOpenedLvlTwo] = useState<string | null>(null);
  const [openedLvlThree, setOpenedLvlThree] = useState<string | null>(null);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <section
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
      className={`${
        isSidebarPinned && !isSidebarHovered ? "collapsed" : "uncollapsed"
      } left-side-bar px-[10px] overflow-y-scroll scrollbar-none ${
        isSidebarHovered && isSidebarPinned ? "w-[240px] " : "w-[68px]"
      }   ${
        isSidebarPinned ? "sidebar-fixed " : "sidebar-sticky"
      } z-50 transition-all duration-300
    text-gray-900 dark:text-white 
    bg-white dark:bg-[#1e2939] 
    shadow-md
   `}
    >
      <div
        className="logo sticky top-0 z-50 bg-white dark:bg-gray-900 border-b 
      border-[#EFEEF1] dark:border-gray-700  mb-[10px] flex items-center justify-between bg-white dark:!bg-[#1e2939]"
      >
        <NavLink to="/" className="flex items-center py-3 ">
          <h1 className="text-[22px] ml-4 dark:text-[#cacaca] font-semibold">Bills</h1>
        </NavLink>
        <button
          onClick={togglePin}
          className="bg-transparent border border-2 h-5 w-5 rounded-full flex items-center justify-center text-primary "
        >
          {!isSidebarPinned && <Dot className="text-primary" />}
        </button>
      </div>
      {/* Side menu ===================  */}
      <nav className="mt-1">
        <ul>
          {menuBar.map((level_one_menu) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                setOpenedLvlOne(
                  openedLvlOne === level_one_menu.id ? null : level_one_menu.id
                );
              }}
              className="Lvl-1  cursor-pointer block 
              transition-all duration-300  "
              key={level_one_menu.id}
            >
              {level_one_menu.hasSubMenu ? (
                <button
                  className={`flex gap-2 sidebar-button  ${
                    openedLvlOne === level_one_menu.id && "active"
                  }`}
                >
                  <img
                    src={`/icons/sidebar/${level_one_menu.iconName}`}
                    alt="iot"
                  />

                  <div className="flex justify-between w-full items-center hideable">
                    <span> {level_one_menu.menuName}</span>
                    <ChevronRight
                      height={20}
                      width={20}
                      className={`transition-all duration-[.3s] ${
                        openedLvlOne === level_one_menu.id && "rotate-[90deg]"
                      }`}
                    />
                  </div>
                </button>
              ) : (
                <NavLink
                  className={({ isActive }) =>
                    `block w-full sidebar-button ${
                      isActive ? "btn-gradient-active shadow-md" : ""
                    }`
                  }
                  to={level_one_menu.path}
                >
                  <span className="flex gap-2">
                    <img
                      src={`/icons/sidebar/${level_one_menu.iconName}`}
                      alt="iot"
                    />
                    <span className="hideable">{level_one_menu.menuName} </span>
                  </span>
                </NavLink>
              )}
              {level_one_menu.hasSubMenu && (
                <ul
                  className={`Lvl-2  transition-all duration-300 overflow-hidden ${
                    openedLvlOne === level_one_menu.id
                      ? "max-h-screen opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {level_one_menu.submenu?.map((level_two_submenu, index) => (
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenedLvlTwo(
                          openedLvlTwo === level_two_submenu.id
                            ? null
                            : level_two_submenu.id
                        );
                      }}
                      className="cursor-pointer block 
                        transition-all duration-300"
                      key={index}
                    >
                      {level_two_submenu.hasSubMenu ? (
                        <button className="sidebar-button flex gap-2 items-center ">
                          <img className="ml-2" src={bullet} alt="bullet" />
                          <div className="flex justify-between w-full items-center">
                            <span className="hideable">
                              {level_two_submenu.menuName}
                            </span>
                          
                            <ChevronRight
                              height={20}
                              width={20}
                              className={` hideable transition-all duration-[.3s]  ${
                                openedLvlTwo === level_two_submenu.id && "rotate-[90deg]"
                              }`}
                            />
                          </div>
                        </button>
                      ) : (
                        <NavLink
                          className={({ isActive }) =>
                            `sidebar-button flex gap-2  block w-full sidebar-button ${
                              isActive ? "btn-gradient-active shadow-md" : ""
                            }`
                          }
                          to={level_two_submenu.path}
                        >
                          <img className="ml-2" src={bullet} alt="bullet" />
                          <span className="hideable">
                            {level_two_submenu.menuName}
                          </span>
                        </NavLink>
                      )}
                      {level_two_submenu.hasSubMenu && (
                        <ul
                          className={`Lvl-2 transition-all duration-300 overflow-hidden ${
                            openedLvlTwo === level_two_submenu.id
                              ? "max-h-screen opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          {/* xxxxxxxxxxxxxxxxx */}
                          {level_two_submenu.submenu?.map(
                            (level_three_submenu, subIndex) => (
                              <li
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenedLvlThree(
                                    openedLvlThree === level_three_submenu.id
                                      ? null
                                      : level_three_submenu.id
                                  );
                                }}
                                className="cursor-pointer block 
                        transition-all duration-300"
                                key={subIndex}
                              >
                                {level_three_submenu.hasSubMenu ? (
                                  <button className="sidebar-button flex gap-2">
                                    <img
                                      className="ml-4"
                                      src={bullet}
                                      alt="bullet"
                                    />
                                    <span className={"hideable"}>
                                      {level_three_submenu.menuName}
                                    </span>
                                  </button>
                                ) : (
                                  <NavLink
                                    className={({ isActive }) =>
                                      `sidebar-button flex gap-2 sidebar-button flex gap-2  block w-full sidebar-button ${
                                        isActive
                                          ? "btn-gradient-active shadow-md"
                                          : ""
                                      }`
                                    }
                                    to={level_three_submenu.path}
                                  >
                                    <img
                                      className="ml-4"
                                      src={bullet}
                                      alt="bullet"
                                    />
                                    <span className={"hideable"}>
                                      {level_three_submenu.menuName}
                                    </span>
                                  </NavLink>
                                )}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logo */}
    </section>
  );
};

export default Sidebar;
