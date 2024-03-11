import { ReactNode } from "react";
import { SnackbarProvider } from "components/notistack";

export default function _SnackbarProvider({ children }: { children: ReactNode | ReactNode[] }) {
  return <SnackbarProvider maxSnack={100}>{children}</SnackbarProvider>;
}
