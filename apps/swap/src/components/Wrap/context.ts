import { createContext } from "react";

export default createContext<{
  retryTrigger: boolean;
  setRetryTrigger: (retryTrigger: boolean) => void;
}>({
  retryTrigger: false,
  setRetryTrigger: (retryTrigger: boolean) => {},
});
