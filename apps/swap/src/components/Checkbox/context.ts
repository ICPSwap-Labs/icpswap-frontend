import { createContext } from "react";

export interface CheckboxContextProps {
  checked: string[];
  onChange: (checked: string[]) => void;
}

export default createContext<CheckboxContextProps>({} as CheckboxContextProps);
