import React, { ReactNode } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { useConnectorStateConnected } from "store/auth/hooks";
import { useWalletConnectorManager } from "store/global/hooks";
import { Override } from "@icpswap/types";
import { t } from "@lingui/macro";
import { CircularProgress } from "@mui/material";

export type ButtonConnectorProps = Override<ButtonProps, { children?: ReactNode; loading?: boolean }>;

export default function ButtonConnector(props: ButtonConnectorProps) {
  const [, manager] = useWalletConnectorManager();
  const isConnected = useConnectorStateConnected();

  const handleConnect = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isConnected) {
      manager(true);
    } else if (props.onClick) props.onClick(event);
  };

  return (
    <Button
      {...{ ...props, loading: undefined }}
      onClick={handleConnect}
      variant={!isConnected ? "contained" : props.variant}
      disabled={!isConnected ? false : !!props.disabled}
      startIcon={
        props.startIcon ? props.startIcon : props.loading ? <CircularProgress color="inherit" size={22} /> : null
      }
    >
      {isConnected ? props.children : t`Connect wallet`}
    </Button>
  );
}
