import { createContext } from "react";
import { SortDirection } from "ui-component/Table/types";

export default createContext<{
  sortField: string;
  sortDirection: SortDirection;
  sortChange: (sortField: string, sortDirection: SortDirection) => void;
}>({
  sortField: "",
  sortDirection: SortDirection.ASC,
  sortChange: (sortField: string, sortDirection: SortDirection) => {},
});
