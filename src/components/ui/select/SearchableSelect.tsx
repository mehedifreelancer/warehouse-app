import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import warningIcon from "../../../assets/icons/form/warning.png";

type Option = string | Record<string, any>;

interface Props {
  name: string;
  label?: string;
  options: Option[];
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  checkErrorField?: string[];
  labelKey?: string; // defaults to "name"
  valueKey?: string; // defaults to "id"
  className?: string; // additional classes for styling
  disabled?: boolean; // to disable the select
}

export default function SearchableSelect({
  name,
  label,
  options,
  value,
  onChange,
  placeholder = "Select option",
  checkErrorField,
  labelKey = "name",
  valueKey = "id",
  disabled = false,
  className,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [openDirection, setOpenDirection] = useState<"up" | "down">("down");

  // Normalize option to { label, value }
  const normalize = (option: Option) => {
    if (typeof option === "string") {
      return { label: option, value: option };
    }
    return {
      label: option[labelKey] ?? "",
      value: option[valueKey] ?? "",
    };
  };

  const normalizedOptions = options.map(normalize);

  const filteredOptions = normalizedOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const handleSelect = (option: { label: string; value: any }) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate dropdown direction
  const toggleDropdown = () => {
    if (!isOpen) {
      const rect = buttonRef.current?.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect && viewportHeight - rect.bottom < 150) {
        setOpenDirection("up");
      } else {
        setOpenDirection("down");
      }
    }
    setIsOpen((prev) => !prev);
  };

  const hasError = Array.isArray(checkErrorField) && checkErrorField.length > 0;

  return (
    <div className="relative w-full flex flex-col justify-between " ref={dropdownRef}>
      {
        disabled && (
          <div className="absolute h-full w-full  bg-gray-700 opacity-50 pointer-events-none rounded z-5" />
        )
      }
      {label && (
        <label
          htmlFor={name}
          className="p-2 block mb-1 text-[14px] font-medium text-[#444050] dark:text-[#cacaca]"
        >
          {label}
        </label>
      )}

      <div
        id={name}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        tabIndex={0}
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleDropdown();
          }
          if (e.key === "Escape") {
            setIsOpen(false);
            setSearchTerm("");
          }
        }}
        ref={buttonRef}
        className={`flex justify-between items-center border-b px-3 py-2 cursor-pointer bg-white rounded transition-colors dark:bg-[#1e2939]! dark:text-white! ${className}  ${
          isOpen
            ? "border-[#1C98D8]"
            : hasError
            ? "border-b-[#FF4C51]"
            : "border-b-gray-300"
        }`}
      >
        <span className="truncate text-[15px]">
          {selectedOption?.label || (
            <span className="text-gray-400 dark:text-[#cacaca]">
              {placeholder}
            </span>
          )}
        </span>
        <ChevronDown
          size={20}
          className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={name}
          className={`shadow-md border border-gray-300 p-2 absolute z-10 w-full bg-white rounded  dark:bg-[#1e2939] dark:border-gray-900 ${
            openDirection === "up" ? "bottom-full mb-2" : "top-full mt-1"
          }`}
        >
          <input
            type="text"
            placeholder="Search..."
            className="mb-2 w-full px-3 py-2 border focus:border-gray-300 focus:outline-none rounded text-[13px] dark:bg-[#1e2939] dark:text-[#cacaca] dark:bg-[#1e2939]!"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <ul className="max-h-40 overflow-y-auto scrollbar-none">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  className={`mb-1 px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-900 cursor-pointer text-[14px] text-gray-700 dark:text-[#cacaca] ${
                    option.value === value
                      ? "bg-gray-100 dark:bg-gray-900 font-semibold"
                      : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-400 text-[14px]">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}

      {hasError && (
        <p className="text-[#FF4C51] text-[12px] mt-1 flex gap-1 items-center">
          <img src={warningIcon} alt="warning-icon" className="w-4 h-4" />
          Please select a valid {label || name}
        </p>
      )}
    </div>
  );
}
