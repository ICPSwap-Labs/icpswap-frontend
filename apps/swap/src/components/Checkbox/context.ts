import { createContext } from "react";

export default createContext<{
  checked: string[];
  onChange: (checked: string[]) => void;
}>({
  checked: [],
  onChange: (checked: string[]) => {},
});
