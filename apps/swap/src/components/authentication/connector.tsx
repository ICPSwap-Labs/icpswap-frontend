import { useEffect, useState } from "react";
import { Box, Typography, useTheme, makeStyles } from "components/Mui";
import { t, Trans } from "@lingui/macro";
import { useErrorTip } from "hooks/useTips";
import { Connector as ConnectorType } from "constants/wallet";
import { WalletConnector } from "utils/connector";
import { useWalletConnectorManager } from "store/auth/hooks";
import { Flex, TextButton, Tooltip } from "@icpswap/ui";

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
  disabled?: boolean;
}

export function ConnectorComponent({ label, value, logo, disabled }: ConnectorProps) {
  const [, walletConnectorManager] = useWalletConnectorManager();

  const theme = useTheme();
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
    if (disabled) return;

    try {
      if (loading || !value || !selfConnector) return;

      if ((!window.ic || !window.ic?.infinityWallet) && value === ConnectorType.INFINITY) {
        openErrorTip(t`Please install the Bitfinity wallet extension!`);
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

        {value === ConnectorType.STOIC ? (
          <Tooltip
            tips={
              <Trans>
                This wallet is no longer supported. You can import your Stoic seed phrase into Plug, which will allow
                you to log in to ICPSwap. Please refer to the tutorial (
                <TextButton
                  sx={{ fontSize: "12px" }}
                  link="https://iloveics.gitbook.io/icpswap/products/wallet/how-to-import-stoic-seed-phrase-into-plug"
                >
                  How to Import Stoic Seed Phrase into Plug | ICPSwap
                </TextButton>
                ) for guidance.
              </Trans>
            }
          >
            <img src="/images/notice_icon.svg" alt="" width="16px" height="16px" style={{ cursor: "pointer" }} />
          </Tooltip>
        ) : null}
      </Flex>

      <Box className={`${classes.loadingWrapper}${loading ? " loading" : ""}`}>
        <img width="40px" height="40px" src={logo} alt="" />
      </Box>
    </Box>
  );
}
