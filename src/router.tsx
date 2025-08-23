import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import NotFound from "./pages/NotFound";
import App from "./App";

// Products
import Product from "./pages/products/Product";
import Color from "./pages/products/Color";
import ProductItem from "./pages/products/ProductItem";
import ProductCategory from "./pages/products/productCategory";

// Warehouse
import Warehouse from "./pages/warehouse/Warehouse";
import Stock from "./pages/warehouse/Stock";

// Authorization
import Users from "./pages/authorization/Users";

// Site settings
import ContactRequests from "./pages/site-settings/ContactRequests";
import BrandItems from "./pages/site-settings/BrandItems";
import MainSite from "./pages/site-settings/MainSite";
import Sliders from "./pages/site-settings/Sliders";
import AboutUs from "./pages/site-settings/AboutUs";

// Orders

// Middleware
import PrivateRoute from "./middleware/PrivateRoute";
import PublicRoute from "./middleware/PublicRoute";

// Auth pages (example: signin/signup)
import SignIn from "./pages/auth/SignIn";
import SocialMediaSettings from "./pages/site-settings/SocialMediaSettings";
import DeliveryCharges from "./pages/order/DeliveryCharges";
import Orders from "./pages/order/Orders";
import Customer from "./services/customer/Customer";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <RootLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <App /> },

      {
        path: "auth",
        children: [
          { path: "groups", element: <>Groups Auth page</> },
          { path: "users", element: <Users /> },
        ],
      },

      {
        path: "order",
        children: [
          { path: "delivery-charges", element: <DeliveryCharges /> },
          { path: "orders", element: <Orders/> },
        ],
      },

      {
        path: "procurement",
        children: [
          { path: "procurement-items", element: <>Order Procurement</> },
        ],
      },

      {
        path: "products",
        children: [
          { path: "product-category", element: <ProductCategory /> },
          { path: "product-colors", element: <Color /> },
          { path: "product-items", element: <ProductItem /> },
          { path: "product-list", element: <Product /> },
        ],
      },

      {
        path: "site-settings",
        children: [
          { path: "about-us", element: <AboutUs /> },
          { path: "contact-requests", element: <ContactRequests /> },
          { path: "brand-items", element: <BrandItems /> },
          { path: "main-sites", element: <MainSite /> },
          { path: "sliders", element: <Sliders /> },
          { path: "social-media-icons", element: <SocialMediaSettings/>},
        ],
      },

      {
        path: "/customer",
        children: [
          {index: true, element: <Customer /> },
        ],
      },

      {
        path: "warehouse",
        children: [
          { path: "stocks", element: <Stock /> },
          { path: "warehouse-list", element: <Warehouse /> },
        ],
      },
    ],
  },

  // Public routes
  {
    path: "/auth/signin",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },

  // Catch all
  { path: "*", element: <NotFound /> },
]);
