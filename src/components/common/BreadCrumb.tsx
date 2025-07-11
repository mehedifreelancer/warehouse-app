import { Home } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const BreadCrumb: React.FC = () => {
  const location = useLocation();
  const [items, setItems] = useState<{ label: string; href?: string }[]>([]);

  useEffect(() => {
    const paths = location.pathname.split("/").filter(Boolean);

    const generatedItems = paths.map((path, index) => {
      const label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        label,
        href:
          index < paths.length - 1
            ? `/${paths.slice(0, index + 1).join("/")}`
            : undefined,
      };
    });

    setItems(generatedItems);
  }, [location]);

  return (
    <nav className="text-sm mt-2 mb-4">
      <ol className="flex items-center gap-1 text-gray-600">
        {/*============ Home Static Link =========*/}
        <li className="flex items-center">
          <Link to="/" className="text-white dark:text-[#1C98D8] hover:underline flex items-center text-sm flex gap-1">
            <Home size={15}/> Home
          </Link>
        </li>

        {/* ============ Dynamic Breadcrumb Items ======== */}
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <span className="mx-1 text-white dark:text-[#ACAAB1] text-[15px]">/</span>
            <li>
              {idx === items.length - 1 || !item.href ? (
                <span className="text-white dark:text-[#ACAAB1] text-sm">{item?.label}</span>
              ) : (
                <li  className="text-white dark:text-[#ACAAB1] text-sm">
                  {item?.label}
                </li>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
