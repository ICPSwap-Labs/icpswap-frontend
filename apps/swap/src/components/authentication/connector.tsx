import { Flex } from "@icpswap/ui";
import { Box, makeStyles, Typography, useTheme } from "components/Mui";
import { Connector, IdentityKitConnector } from "constants/index";
import { useErrorTip } from "hooks/useTips";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useConnectManager, useShowConnector } from "store/auth/hooks";
import { WalletConnector } from "utils/connector";
import { isSafari } from "utils/index";

const useStyles = makeStyles(() => {
  return {
    loadingWrapper: {
      width: "36px",
      height: "36px",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      "& img": {
        width: "32px",
        height: "32px",
        objectFit: "contain",
      },
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
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const [openErrorTip] = useErrorTip();
  const { connect } = useConnectManager();
  const { showConnector } = useShowConnector();

  const [loading, setLoading] = useState(false);
  const [initialedConnector, setInitialedConnector] = useState<null | WalletConnector>(null);

  // Only safari need init connector first for fix pop-up was
  // blocked when there has a asynchronous call before connecting the wallet
  useEffect(() => {
    async function call() {
      // Filter connector like NFID
      if (!IdentityKitConnector.includes(value)) {
        const initialedConnector = new WalletConnector();
        await initialedConnector.init(value);
        setInitialedConnector(initialedConnector);
      }
    }

    if (isSafari()) {
      call();
    }
  }, [value]);

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

      const connectSuccessful = await connect(value, initialedConnector);

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
      className="ics-wallet-choice"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: "12px 14px",
        minHeight: "64px",
        gap: "12px",
        background: "var(--color-base-200)",
        border: "1px solid color-mix(in srgb, var(--color-base-content) 8%, transparent)",
        borderRadius: "12px",
        opacity: disabled ? 0.45 : 1,
        transition: "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
        "&:hover": disabled
          ? {}
          : {
              backgroundColor: "color-mix(in srgb, var(--color-primary) 7%, var(--color-base-200))",
              borderColor: "color-mix(in srgb, var(--color-primary) 40%, transparent)",
              boxShadow: "0 4px 16px color-mix(in srgb, var(--color-primary) 6%, transparent)",
            },
        [theme.breakpoints.down("md")]: {
          padding: "10px 14px",
          minHeight: "58px",
        },
      }}
      onClick={handleConnect}
    >
      <Flex gap="0 8px">
        <Typography color="text.primary" fontSize="13px" fontWeight={500} sx={{ lineHeight: 1.4 }}>
          {label}
        </Typography>
      </Flex>

      <Box className={`${classes.loadingWrapper}${loading ? " loading" : ""}`}>
        <img width="40px" height="40px" src={logo} alt="" />
      </Box>
    </Box>
  );
}
