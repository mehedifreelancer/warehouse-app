import { Navigate } from "react-router-dom";
import { decryptToken, isTokenExpired } from "../utils/handleToken";
import Cookies from "js-cookie";


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const encryptedToken = Cookies.get("authToken");
  const token = decryptToken(encryptedToken);
  const isAuthenticated = token && !isTokenExpired(token);

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
