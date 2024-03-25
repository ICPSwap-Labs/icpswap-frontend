import { createContext } from "react";

export interface WrapContextProps {
  retryTrigger: boolean;
  setRetryTrigger: (retryTrigger: boolean) => void;
}

export default createContext<WrapContextProps>({
  retryTrigger: false,
} as WrapContextProps);
