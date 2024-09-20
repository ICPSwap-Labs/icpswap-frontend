import { makeStyles } from "@mui/styles";
import { Box, Grid, Typography } from "@mui/material";
import Modal from "components/modal";
import { Trans, t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { TextButton } from "components/index";
import { Connector } from "constants/wallet";
import { useWalletConnectorManager } from "store/auth/hooks";

import { ConnectorComponent } from "./connector";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      position: "relative",
      borderRadius: "12px",
      maxWidth: "100%",
    },
    walletBox: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px 16px",
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "1fr ",
        gap: "16px 0",
      },
    },
    walletWrapper: {
      cursor: "pointer",
      padding: "12px 16px",
      background: "rgba(255, 255, 255, 0.08)",
      borderRadius: "8px",
      [theme.breakpoints.down("md")]: {
        padding: "8px 14px",
      },
    },
    walletComingSoon: {
      height: "80px",
      background: "rgba(17, 25, 54, 0.4)",
      border: "1px solid #29314F",
      borderRadius: "8px",
      [theme.breakpoints.down("md")]: {
        height: "64px",
      },
    },
  };
});

type Wallet = {
  label: string;
  value: Connector;
  logo: any;
  tips?: string;
};

export default function WalletConnector() {
  const [open, walletConnectorManager] = useWalletConnectorManager();

  const classes = useStyles();

  const Wallets: Wallet[] = [
    // {
    //   label: "Internet Identity",
    //   value: Connector.IC,
    //   logo: "/images/connect/InternetIdentity.svg",
    // },
    // { label: "Plug", value: Connector.PLUG, logo: "/images/connect/Plug.svg" },
    {
      label: "Stoic Wallet",
      value: Connector.STOIC,
      logo: "/images/connect/stoic.svg",
    },
    // {
    //   label: "ICPSwap Wallet",
    //   value: Connector.ICPSwap,
    //   logo: "/images/connect/icpswap.svg",
    // },
    // { label: "NFID", value: Connector.NFID, logo: "/images/connect/NFID.svg" },
    // {
    //   label: "Bitfinity Wallet",
    //   value: Connector.INFINITY,
    //   logo: "/images/connect/Infinity.svg",
    // },
    // {
    //   label: "AstroX ME",
    //   value: Connector.ME,
    //   logo: "/images/connect/AstroX.svg",
    // },
    // {
    //   label: "MetaMask",
    //   value: Connector.Metamask,
    //   logo: "/images/connect/metamask.svg",
    // },
  ];

  return (
    <Modal open={open} onClose={() => walletConnectorManager(false)} title={t`Connect a wallet`}>
      <Grid container alignItems="center" flexDirection="column">
        <Box className={classes.wrapper}>
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "20px",
              }}
            >
              <Trans>
                By connecting a wallet, you agree to ICPSwap’s{" "}
                <TextButton link="https://iloveics.gitbook.io/icpswap/legal-and-privacy/icpswap-terms-of-service">
                  Terms of Service
                </TextButton>{" "}
                and acknowledge that you have read and understand the{" "}
                <TextButton
                  link="https://iloveics.gitbook.io/icpswap/legal-and-privacy/icpswap-disclaimer"
                  sx={{
                    marginLeft: "0!important",
                  }}
                >
                  ICPSwap Disclaimer
                </TextButton>
                .
              </Trans>
            </Typography>
          </Box>
          <Box mt="24px">
            <Box className={classes.walletBox}>
              {Wallets.map((wallet) => (
                <ConnectorComponent key={wallet.value} label={wallet.label} logo={wallet.logo} value={wallet.value} />
              ))}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Modal>
  );
}
