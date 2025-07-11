import notification from "../../assets/icons/header/notification.svg";
import avatar from "../../assets/icons/header/avatar.png";
import logoutIcon from "../../assets/icons/header/logout.svg";
import profileArrow from "../../assets/icons/header/profile-arrow.svg";
import Button from "../ui/Button";
import { Lock, Moon, Sun } from "lucide-react";
import { useMode } from "../../hooks/useMode";
import Dropdown from "../ui/Dropdown";
import BreadCrumb from "./BreadCrumb";



// ================ sample data ==========///


const Header = () => {
  const [mode, toggleMode] = useMode();
  return (
    <div className="bg-[#1C98D8] dark:bg-[#1e2939] text-white py-[8px] px-[24px] shadow-md rounded-md sticky top-[.5px] z-10 mb-2">
      <div className="flex justify-between items-center">
        {/* Header left */}
        <div className="flex gap-2 items-center">
           {<BreadCrumb  />}
        </div>
        <div className="flex gap-[20px] items-center relative">

          {/* <Dropdown
            trigger={
              <button
                type="button"
                role="button"
                aria-label="Toggle Notification Dropdown"
              >
                <img
                  className="h-[25px]"
                  src={notification}
                  alt="Notification icon"
                />
                <span className="absolute top-[-2px] right-[-2px] h-[15px] w-[15px] bg-[#F93C65] rounded-[50%] font-bold text-[12px]">
                  6
                </span>
              </button>
            }
          >
            <div className="w-[401px] bg-white mt-1 rounded-md border border-[#DDDDDD] px-[15px] dark:bg-[#1e2939] dark:border-gray-900 shadow-lg max-h-[500px] overflow-auto scrollbar-none">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="py-[10px]">
                  <div className="flex justify-between mb-[5px] items-center ">
                    <div className="flex gap-x-[10px]">
                      <button className="bg-[#DDF6E8] text-[#28C76F] px-2 py-1 text-[13px] rounded-xs">
                        New Job
                      </button>
                      <p className="text-[#444050] dark:text-[#cacaca] text-sm">
                        App Test 123
                      </p>
                    </div>
                    <p className="text-[13px] text-[#6D6B77] dark:text-[#cacaca]">
                      Req No :{" "}
                      <span className="text-[#444050] dark:text-[#cacaca]">
                        3996
                      </span>
                    </p>
                  </div>

                  <p className="text-[13px] text-[#6D6B77] dark:text-[#cacaca] mb-[10px]">
                    [ Desk : Mobilon Tape Mark For Getharning ]
                  </p>

                  <div className="pb-[5px]">
                    <div className="flex justify-between text-[#444050] dark:text-[#cacaca] text-[13px]">
                      <p>
                        Require :{" "}
                        <span className="text-[#6D6B77] dark:text-[#cacaca]">
                          23 Sep 10:31 PM
                        </span>
                      </p>
                      <p className="text-[#6D6B77] dark:text-[#cacaca]">
                        Req Qty : <span>0</span>
                      </p>
                    </div>

                    <div className="flex justify-between text-[#6D6B77] dark:text-[#cacaca] text-[13px] items-center">
                      <p>80% time passed</p>
                      <div className="flex gap-x-1">
                        <p>Tot Sz Qty :</p>
                        <span>2</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[#ACAAB1] text-[13px] text-end">
                    12hr ago
                  </p>
                </div>
              ))}
            </div>
          </Dropdown> */}
          <Button onClick={toggleMode} shadowOnHover={false}>
            {mode && mode === "dark" ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </Button>
          <Dropdown
            trigger={
              <button
                type="button"
                role="button"
                aria-label="Toggle Notification Dropdown"
                className="flex gap-4 items-center"
              >
                <img
                  className="h-[35px] w-[35px] rounded-[50%]"
                  src={avatar}
                  alt="avatar"
                />
                <div className="text-left">
                  <h3 className="font-semibold text-[15px]">Jhon Doe</h3>
                  <p className="text-[13px]">Admin</p>
                </div>

                <img src={profileArrow} alt="down_arrow" />
              </button>
            }
          >
            <ul className="w-[220px] bg-[#fff] rounded-md flex flex-col gap-y-3 py-[21px] dark:bg-[#1e2939] dark:border-gray-900 scrollbar-none shadow-lg">
              <li className="rounded hover:bg-[#F3F3F4] dark:hover:bg-gray-900 transaction-[.3s] py-2 justify-between px-[24px] cursor-pointer flex gap-x-3 items-center text-[#444050] text-sm">
                <Lock
                  height={20}
                  width={20}
                  className="text-[#444050] dark:text-[#cacaca]"
                />
                <p className="text-base text-[#444050] leading-[150%] dark:text-[#cacaca]">
                  Change Password
                </p>
              </li>
              <li className="dark:hover:bg-gray-900  rounded hover:bg-[#F3F3F4] transaction-[.3s] py-2 cursor-pointer  px-[24px] flex gap-x-3 items-center text-[#444050] text-sm">
                <img
                  src={logoutIcon}
                  alt="lock icon"
                  className="w-[24px] h-[24px]"
                />
                <p className="text-base leading-[150%] text-[#FF3B30]">
                  Logout
                </p>
              </li>
            </ul>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Header;
