import { createContext } from "react";
import { SortDirection } from "./types";

export interface HeaderContextProps {
  sortField: string;
  sortDirection: SortDirection;
  sortChange: (sortField: string, sortDirection: SortDirection) => void;
}

export default createContext<HeaderContextProps>({
  sortField: "",
  sortDirection: SortDirection.ASC,
} as HeaderContextProps);
