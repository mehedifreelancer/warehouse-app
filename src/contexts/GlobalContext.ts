// contexts/GlobalContext.ts
import { createContext } from "react";
import type { GlobalContextType } from "../types/context.type";



export const GlobalContext = createContext<GlobalContextType>({
  modalVisibility: false,
  setModalVisibility: () => {}, 
});
