import type { Override } from "@icpswap/types";
import { Button, type ButtonProps, CircularProgress } from "components/Mui";
import type React from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useConnectManager, useWalletIsConnected } from "store/auth/hooks";

export type ButtonConnectorProps = Override<ButtonProps, { children?: ReactNode; loading?: boolean }>;

export default function ButtonConnector(props: ButtonConnectorProps) {
  const { t } = useTranslation();
  const { showConnector } = useConnectManager();
  const isConnected = useWalletIsConnected();

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
