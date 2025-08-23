import { jwtDecode } from "jwt-decode";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const handleToken = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{
      id: string;
      // email: string;
      exp: number;
    }>(token);

    if (decoded.exp * 1000 < Date.now()) {
      throw new Error("Token is expired");
    }
    const userData = {
      id: decoded.id,
      // orgId: decoded.orgId,
      // sub: decoded.sub,
      // role: decoded.roles?.[0]?.split("_")[1] ?? null,
    };

    const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
    if (!SECRET_KEY) throw new Error("Missing SECRET_KEY in environment");

    const encryptedToken = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();

    // Use Date object for cookie expiration
    const expiryDate = new Date(decoded.exp * 1000);

    Cookies.set("authToken", encryptedToken, {
      secure: true,
      sameSite: "Strict",
      expires: expiryDate,
    });
    Cookies.set("userData", JSON.stringify(userData), {
      secure: true,
      sameSite: "Strict",
      expires: expiryDate,
    });

    return true;
  } catch (error) {
    console.error("Failed to handle token:", error);
    return false;
  }
};

export const decryptToken = (encryptedToken: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
