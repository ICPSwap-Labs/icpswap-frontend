import { useState } from "react";
import { Box, Typography, useTheme, makeStyles } from "components/Mui";
import { t } from "@lingui/macro";
import { useErrorTip } from "hooks/useTips";
import { Connector } from "constants/wallet";
import { useConnectManager } from "store/auth/hooks";
import { Flex } from "@icpswap/ui";

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
  value: Connector;
  logo: string;
  disabled?: boolean;
}

export function ConnectorComponent({ label, value, logo, disabled }: ConnectorProps) {
  const theme = useTheme();
  const classes = useStyles();
  const [openErrorTip] = useErrorTip();
  const { showConnector, connect } = useConnectManager();

  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (disabled) return;

    try {
      if (loading || !value) return;

      if ((!window.ic || !window.ic?.infinityWallet) && value === Connector.INFINITY) {
        openErrorTip(t`Please install the Bitfinity wallet extension!`);
        return;
      }

      if ((!window.ic || !window.ic?.plug) && value === Connector.PLUG) {
        openErrorTip(t`Please install the plug wallet extension!`);
        return;
      }

      setLoading(true);

      const connectSuccessful = await connect(value);

      if (!connectSuccessful) {
        openErrorTip(t`An unknown error occurred. Please try connect again.`);
      }

      showConnector(false);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);

      openErrorTip(`Failed to connect to ${label}: ${error}`);
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
      <Flex gap="0 8px">
        <Typography color="text.primary" fontSize="14px" fontWeight={700}>
          {label}
        </Typography>
      </Flex>

      <Box className={`${classes.loadingWrapper}${loading ? " loading" : ""}`}>
        <img width="40px" height="40px" src={logo} alt="" />
      </Box>
    </Box>
  );
}
