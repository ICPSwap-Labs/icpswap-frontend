import { SnackbarProvider } from "components/notistack";
import type { ReactNode } from "react";

export default function _SnackbarProvider({ children }: { children: ReactNode | ReactNode[] }) {
  return <SnackbarProvider maxSnack={100}>{children}</SnackbarProvider>;
}
