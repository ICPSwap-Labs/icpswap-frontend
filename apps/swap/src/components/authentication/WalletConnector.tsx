import { ReactNode } from "react";
import { Grid } from "@mui/material";
import { useWalletConnectorManager } from "store/auth/hooks";

export default function WalletConnector({ children }: { children: ReactNode }) {
  const [, manager] = useWalletConnectorManager();

  return (
    <Grid container alignItems="center" justifyContent="center" onClick={() => manager(true)}>
      {children}
    </Grid>
  );
}
