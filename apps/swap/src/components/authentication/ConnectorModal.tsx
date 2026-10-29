import { useDesignVersion } from "hooks/useDesignVersion";
import { Flex, TextButton } from "components/index";
import { Box, makeStyles, type Theme, Typography } from "components/Mui";
import Modal from "components/modal";
import { ConnectorConfigs } from "constants/wallet";
import { Trans, useTranslation } from "react-i18next";
import { useShowConnector } from "store/auth/hooks";

import { ConnectorComponent } from "./connector";

const useStyles = makeStyles((theme: Theme) => {
  return theme.customization?.designVersion !== "modern"
    ? {
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
      }
    : {
        wrapper: {
          position: "relative",
          width: "100%",
          maxWidth: "100%",
        },
        walletBox: {
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "10px",
          [theme.breakpoints.down("md")]: {
            gridTemplateColumns: "1fr ",
            gap: "8px",
          },
        },
        walletWrapper: {
          cursor: "pointer",
          padding: "12px 16px",
          background: "var(--color-base-200)",
          borderRadius: "6px",
          border: "1px solid color-mix(in srgb, var(--color-base-content) 8%, transparent)",
          [theme.breakpoints.down("md")]: {
            padding: "8px 14px",
          },
        },
        walletComingSoon: {
          height: "80px",
          background: "var(--color-base-200)",
          border: "1px solid color-mix(in srgb, var(--color-base-content) 6%, transparent)",
          borderRadius: "6px",
          [theme.breakpoints.down("md")]: {
            height: "64px",
          },
        },
      };
});

export default function WalletConnector() {
  const { isClassicDesign } = useDesignVersion();

  const { t } = useTranslation();
  const classes = useStyles();

  const { open, showConnector } = useShowConnector();

  if (isClassicDesign) {
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
                {ConnectorConfigs.map((wallet) => (
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

  return (
    <Modal open={open} onClose={() => showConnector(false)} title={t("auth.connect.a.wallet")}>
      <Flex align="center" sx={{ width: "100%" }}>
        <Box className={classes.wrapper}>
          <Typography
            sx={{
              fontSize: "13px",
              lineHeight: 1.8,
              color: "color-mix(in srgb, var(--color-base-content) 68%, transparent)",
              "& a, & span": { lineHeight: "inherit" },
              "& a": { fontSize: "inherit", color: "var(--color-primary)" },
              "& .custom-text-button": { fontSize: "inherit", color: "var(--color-primary)" },
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
              {ConnectorConfigs.map((wallet) => (
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
