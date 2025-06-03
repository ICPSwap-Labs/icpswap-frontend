import { ReactNode } from "react";

export type MenuProps = {
  label: ReactNode;
  value: any;
  selectLabel?: ReactNode;
  additional?: string;
};
