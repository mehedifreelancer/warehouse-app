import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { decryptToken, isTokenExpired } from "../utils/handleToken";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const encryptedToken = Cookies.get("authToken");
  const token = decryptToken(encryptedToken);
  const isAuthenticated = token && !isTokenExpired(token);
  


  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
