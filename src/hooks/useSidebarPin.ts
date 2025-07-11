// useSidebarPin.ts
import { useEffect, useState } from "react";

const STORAGE_KEY = "sidebarPinned";

export function useSidebarPin() {
  const [isPinned, setIsPinned] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isPinned));
  }, [isPinned]);

  const togglePin = () => setIsPinned((prev:unknown) => !prev);

  return [isPinned, togglePin] as const;
}
