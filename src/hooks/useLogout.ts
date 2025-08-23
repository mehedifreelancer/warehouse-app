import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export function useLogout() {
  const navigate = useNavigate();

  return () => {
    Cookies.remove("authToken");
    Cookies.remove("userData");
    sessionStorage.clear();
    // localStorage.clear();
    navigate("/auth/signin", { replace: true });
  };
}
