import React, { ReactNode } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { useConnectManager, useConnectorStateConnected } from "store/auth/hooks";
import { Override } from "@icpswap/types";
import { CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

export type ButtonConnectorProps = Override<ButtonProps, { children?: ReactNode; loading?: boolean }>;

export default function ButtonConnector(props: ButtonConnectorProps) {
  const { t } = useTranslation();
  const { showConnector } = useConnectManager();
  const isConnected = useConnectorStateConnected();

  const handleConnect = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isConnected) {
      showConnector(true);
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
      {isConnected ? props.children : t("common.connect.wallet")}
    </Button>
  );
}
