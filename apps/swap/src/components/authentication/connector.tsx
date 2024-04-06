import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { useErrorTip } from "hooks/useTips";
import { Connector as ConnectorType } from "constants/wallet";
import { WalletConnector } from "utils/connector";
import { useWalletConnectorManager } from "store/auth/hooks";
import { sendSentryError } from "hooks/useTracingTransaction";

const useStyles = makeStyles(() => {
  return {
    loadingWrapper: {
      width: "40px",
      height: "40px",
      overflow: "hidden",
      "&.loading": {
        animation: `$loading 1000ms`,
        animationIterationCount: "infinite",
      },
    },
    "@keyframes loading": {
      "0%": {
        transform: "rotate(0deg)",
      },
      "100%": {
        transform: "rotate(360deg)",
      },
    },
  };
});

export interface ConnectorProps {
  label: string;
  value: ConnectorType;
  logo: string;
}

export function ConnectorComponent({ label, value, logo }: ConnectorProps) {
  const [, walletConnectorManager] = useWalletConnectorManager();

  const theme = useTheme() as Theme;
  const classes = useStyles();
  const [openErrorTip] = useErrorTip();

  const [loading, setLoading] = useState(false);
  const [selfConnector, setSelfConnector] = useState<null | WalletConnector>(null);

  useEffect(() => {
    async function call() {
      const selfConnector = new WalletConnector();
      await selfConnector.init(value);
      setSelfConnector(selfConnector);
    }

    call();
  }, []);

  const handleConnect = async () => {
    try {
      if (loading || !value || !selfConnector) return;

      if ((!window.ic || !window.ic?.infinityWallet) && value === ConnectorType.INFINITY) {
        openErrorTip(t`Please install the infinity wallet extension!`);
        return;
      }

      if ((!window.ic || !window.ic?.plug) && value === ConnectorType.PLUG) {
        openErrorTip(t`Please install the plug wallet extension!`);
        return;
      }

      setLoading(true);

      const connectSuccessful = await selfConnector.connect();

      if (!connectSuccessful) {
        openErrorTip(t`An unknown error occurred. Please try connect again.`);
      }

      walletConnectorManager(false);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);

      openErrorTip(`Failed to connect to ${label}: ${error}`);

      if (!error.toString().includes("UserInterrupt")) {
        sendSentryError(`connect to ${label}: ${error}`);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        padding: "12px 16px",
        background: "rgba(255, 255, 255, 0.08)",
        borderRadius: "8px",
        [theme.breakpoints.down("md")]: {
          padding: "8px 14px",
        },
      }}
      onClick={handleConnect}
    >
      <Typography color="text.primary" fontSize="14px" fontWeight={700}>
        {label}
      </Typography>

      <Box className={`${classes.loadingWrapper}${loading ? " loading" : ""}`}>
        <img width="40px" height="40px" src={logo} alt="" />
      </Box>
    </Box>
  );
}
