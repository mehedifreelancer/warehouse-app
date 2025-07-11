import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";


interface DropdownProps {
  trigger: ReactNode | ((isOpen : boolean)=> ReactNode); // The button or element that triggers the dropdown
  children: ReactNode; // The dropdown content
}

const Dropdown = ({ trigger, children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
         {typeof trigger === 'function' ? trigger(isOpen) : trigger}
      </div>
      <div
        className={`absolute right-0 mt-4 text-black rounded-md shadow-lg transform transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;