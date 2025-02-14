import { Box, makeStyles, Theme, Typography } from "components/Mui";
import Modal from "components/modal";
import { Flex, TextButton } from "components/index";
import { Connector } from "constants/wallet";
import { useConnectManager } from "store/auth/hooks";
import { useTranslation, Trans } from "react-i18next";

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
  disabled?: boolean;
};

const Wallets: Wallet[] = [
  {
    label: "Internet Identity",
    value: Connector.IC,
    logo: "/images/connect/InternetIdentity.svg",
  },
  { label: "Plug", value: Connector.PLUG, logo: "/images/connect/Plug.svg" },
  {
    label: "Stoic Wallet",
    value: Connector.STOIC,
    logo: "/images/connect/stoic.svg",
  },
  {
    label: "ICPSwap Wallet",
    value: Connector.ICPSwap,
    logo: "/images/connect/icpswap.svg",
  },
  { label: "NFID", value: Connector.NFID, logo: "/images/connect/NFID.svg" },
  {
    label: "Bitfinity Wallet",
    value: Connector.INFINITY,
    logo: "/images/connect/Infinity.svg",
  },
  {
    label: "AstroX ME",
    value: Connector.ME,
    logo: "/images/connect/AstroX.svg",
  },
  {
    label: "MetaMask",
    value: Connector.Metamask,
    logo: "/images/connect/metamask.svg",
  },
];

export default function WalletConnector() {
  const { t } = useTranslation();
  const classes = useStyles();

  const { open, showConnector } = useConnectManager();

  return (
    <Modal open={open} onClose={() => showConnector(false)} title={t("auth.connect.a.wallet")}>
      <Flex align="center">
        <Box className={classes.wrapper}>
          <Typography
            sx={{
              fontSize: "16px",
              lineHeight: "20px",
            }}
          >
            <Trans
              components={{
                highlight0: (
                  <TextButton link="https://iloveics.gitbook.io/icpswap/legal-and-privacy/icpswap-terms-of-service" />
                ),
                highlight1: (
                  <TextButton
                    link="https://iloveics.gitbook.io/icpswap/legal-and-privacy/icpswap-disclaimer"
                    sx={{
                      marginLeft: "0!important",
                    }}
                  />
                ),
              }}
              i18nKey="wallet.authentication.agree"
            />
          </Typography>

          <Box mt="24px">
            <Box className={classes.walletBox}>
              {Wallets.map((wallet) => (
                <ConnectorComponent
                  key={wallet.value}
                  label={wallet.label}
                  logo={wallet.logo}
                  value={wallet.value}
                  disabled={wallet.disabled}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Flex>
    </Modal>
  );
}
