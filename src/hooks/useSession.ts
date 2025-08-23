import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export const useSession = <T>(key: string): T | null => {
    const [sessionData, setSessionData] = useState<T | null>(null);

    useEffect(() => {
        try {
            const raw = Cookies.get(key); // ✅ Read from cookies

            if (raw) {
                setSessionData(JSON.parse(raw) as T);
            }
        } catch (error) {
            console.error(`Failed to parse session data for key "${key}"`, error);
        }
    }, [key]);

    return sessionData;
};
