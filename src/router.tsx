import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import NotFound from "./pages/NotFound";
import App from "./App";
import Product from "./pages/products/Product";
import Color from "./pages/products/Color";
import ProductItem from "./pages/products/ProductItem";
import Warehouse from "./pages/warehouse/Warehouse";
import Stock from "./pages/warehouse/Stock";
import Users from "./pages/authorization/Users";
import ContactRequests from "./pages/site-settings/ContactRequests";
import BrandItems from "./pages/site-settings/BrandItems";
import MainSite from "./pages/site-settings/MainSite";


// You can import other placeholder components as needed

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <App /> },

      {
        path: "auth",
        children: [
          { path: "groups", element: (<>Groups Auth page</>) },
          { path: "users", element: (<Users/>) },
        ],
      },
      {
        path: "order",
        children: [
          { path: "deliverey-charges", element: (<>Order Delivery Charge</>) },
          { path: "orders", element: (<>Users Auth page</>) },
        ],
      },
      {
        path: "procurement",
        children: [
          { path: "procurement-items", element: (<>Order Procurement</>) },
        ],
      },
      {
        path: "products",
        children: [
          { path: "product-category", element: (<>product-category page</>) },
          { path: "product-colors", element: (<Color/>) },
          { path: "product-items", element: (<ProductItem/>) },
          { path: "product-list", element: (<Product/>) },
        ],
      },
      {
        path: "site-settings",
        children: [
          { path: "about-us", element: (<>About us  page</>) },
          { path: "contact-requests", element: (<ContactRequests/>) },
          { path: "brand-items", element: (<BrandItems/>) },
          { path: "main-sites", element: (<MainSite/>) },
          { path: "sliders", element: (<>Sliders  page</>) },
          { path: "social-media-icons", element: (<>Social Media settings  page</>) },

        ],
      },
      {
        path: "user",
        children: [
          { path: "address", element: (<>Address  page</>) },
          { path: "customer", element: (<>Customer  page</>) },
        ],
      },
      {
        path: "Warehouse",
        children: [
          { path: "stocks", element: (<Stock/>) },
          { path: "warehouse-list", element: (<Warehouse/>) },
        ],
      },





      // {
      //   path: "qms",
      //   children: [
      //     {
      //       path: "dashboard",
      //       children: [
      //         { path: "quality-dashboard", element: (<></>) },
      //         { path: "silhouette-dashboard", element: (<></>) },
      //         { path: "production-dashboard", element: (<></>) },
      //         { path: "floor-dashboard", element: (<></>) },
      //       ],
      //     },
      //     {path: "qc-pass",element: (<></>)},
      //     {path: "pareto-analysis",element: (<></>)},
      //     {path: "order-status",element: (<></>)},
      //     {path: "defect-analysis",element: (<></>)},
      //     {path: "line-info",element: (<></>)},
      //     {path: "line-configuration",element: (<></>)},
      //     {path: "sweing-input-report",element: (<></>)},
      //     {path: "manual-sewing-input",element: (<></>)}
      //   ],
      // },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
