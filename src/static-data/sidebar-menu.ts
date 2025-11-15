interface MenuItem {
  id: string;
  menuName: string;
  hasSubMenu: boolean;
  path: string;
  submenu?: MenuItem[];
  iconName: string;
}

type MenuBar = MenuItem[];

export const menuBar: MenuBar = [
  {
    id: "home",
    menuName: "Dashboard",
    hasSubMenu: false,
    path: "/",
    iconName: "home.svg",
  },

  {
    id: "authentication",
    menuName: "Authentication",
    hasSubMenu: true,
    path: "#",
    iconName: "download.svg",
    submenu: [
      {
        id: "groups",
        menuName: "Groups",
        hasSubMenu: false,
        path: "auth/groups",
        iconName: "apk-upload.svg",
      },
      {
        id: "users",
        menuName: "Users",
        hasSubMenu: false,
        path: "auth/users",
        iconName: "apk-download.svg",
      },
    ],
  },
  {
    id: "Order",
    menuName: "Order",
    hasSubMenu: true,
    path: "#",
    iconName: "administration.svg",
    submenu: [
      {
        id: "deliverey-charges",
        menuName: "Delivery Charges",
        hasSubMenu: false,
        path: "/order/delivery-charges",
        iconName: "settings.svg",
      },
      {
        id: "orders",
        menuName: "Orders",
        hasSubMenu: true,
        path: "#",
        iconName: "sketch-library.svg",
        submenu: [
          {
            id: "pending",
            menuName: "New",
            hasSubMenu: false,
            path: "/order/pending-orders",
            iconName: "iot-device.svg",
          },
          {
            id: "processing",
            menuName: "Processing",
            hasSubMenu: false,
            path: "/order/processing-orders",
            iconName: "iot-device.svg",
          },
          {
            id: "in_prourement",
            menuName: "In Procurement",
            hasSubMenu: false,
            path: "/order/inprocurement-orders",
            iconName: "iot-device.svg",
          },
          {
            id: "shipped",
            menuName: "Shipped",
            hasSubMenu: false,
            path: "/order/shipped-orders",
            iconName: "iot-device.svg",
          },
          {
            id: "delivered",
            menuName: "Delivered",
            hasSubMenu: false,
            path: "/order/delivered-orders",
            iconName: "iot-device.svg",
          },
          {
            id: "cacelled",
            menuName: "Cancelled",
            hasSubMenu: false,
            path: "/order/cancelled-orders",
            iconName: "iot-device.svg",
          },
        ],
      },
    ],
  },
  {
    id: "procurement",
    menuName: "Procurement",
    hasSubMenu: true,
    path: "#",
    iconName: "iot.svg",
    submenu: [
      {
        id: "iot-device",
        menuName: "Procurement Items",
        hasSubMenu: false,
        path: "/procurement/procurement-items",
        iconName: "iot-device.svg",
      },
    ],
  },
  {
    id: "products",
    menuName: "Products",
    hasSubMenu: true,
    path: "#",
    iconName: "kanban.svg",
    submenu: [
      {
        id: "kanban-requisition",
        menuName: "Product Category",
        hasSubMenu: false,
        path: "products/product-category",
        iconName: "kanban-requisition.svg",
      },
      {
        id: "kanban-review-selection",
        menuName: "Product Colors",
        hasSubMenu: false,
        path: "products/product-colors",
        iconName: "kanban-requisition-review.svg",
      },
      {
        id: "kanban-requisition-review",
        menuName: "Product Items",
        hasSubMenu: false,
        path: "products/product-items",
        iconName: "kanban-requisition-review.svg",
      },

      {
        id: "kanban-color-size-selection",
        menuName: "Products",
        hasSubMenu: false,
        path: "products/product-list",
        iconName: "kanban-color-size-selection.svg",
      },
    ],
  },
  {
    id: "site-settings",
    menuName: "Site Settings",
    hasSubMenu: true,
    path: "#",
    iconName: "master-data.svg",
    submenu: [
      {
        id: "about-us",
        menuName: "About Us",
        hasSubMenu: false,
        path: "/site-settings/about-us",
        iconName: "master-data-organizations.svg",
      },
      {
        id: "brand-items",
        menuName: "Brand Items",
        hasSubMenu: false,
        path: "/site-settings/brand-items",
        iconName: "master-data-excel-upload.svg",
      },
      {
        id: "site-settings",
        menuName: "Contact Requests",
        hasSubMenu: false,
        path: "/site-settings/contact-requests",
        iconName: "master-data-operations.svg",
      },
      {
        id: "main-sites",
        menuName: "Main Sites",
        hasSubMenu: false,
        path: "/site-settings/main-sites",
        iconName: "master-data-employees.svg",
      },
      {
        id: "sliders",
        menuName: "Sliders",
        hasSubMenu: false,
        path: "/site-settings/sliders",
        iconName: "master-data-buyers.svg",
      },
      {
        id: "social-media-icons",
        menuName: "Social Media Icons",
        hasSubMenu: false,
        path: "/site-settings/social-media-icons",
        iconName: "master-data-buyers-orders.svg",
      },
    ],
  },
  {
    id: "customer-management",
    menuName: "Customer",
    hasSubMenu: false,
    path: "/customer",
    iconName: "pre-production.svg",
  },
  {
    id: "warehouse",
    menuName: "Warehouse",
    hasSubMenu: true,
    path: "#",
    iconName: "download.svg",
    submenu: [
      {
        id: "stocks",
        menuName: "Stocks",
        hasSubMenu: false,
        path: "/warehouse/stocks",
        iconName: "QMS-dashboard.svg",
      },
      {
        id: "warehouse-list",
        menuName: "Warehouses",
        hasSubMenu: false,
        path: "/warehouse/warehouse-list",
        iconName: "QMS-dashboard.svg",
      },
    ],
  },
];
