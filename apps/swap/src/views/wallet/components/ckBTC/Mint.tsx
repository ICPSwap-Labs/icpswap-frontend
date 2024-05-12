import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import QRCode from "components/qrcode";
import { useBTCDepositAddress, useUpdateBalanceCallback } from "hooks/ck-btc/useBTCCalls";
import { useAccountPrincipalString } from "store/auth/hooks";
import Copy, { CopyRef } from "components/Copy";
import { useState, useRef } from "react";
import { ckBTC_ID } from "constants/ckBTC";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { parseTokenAmount } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { useTips, MessageTypes } from "hooks/useTips";
import { MainCard, type Tab } from "components/index";
import { RefreshIcon } from "assets/icons/Refresh";

import Transaction from "./Transaction";
import Links from "./Links";
import Logo from "./Logo";
import { LogosWrapper } from "../ckTokens/LogosWrapper";
import { MainContent } from "../ckTokens/MainContent";

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.6654 5.33333H2.66536V13.3333H10.6654V5.33333ZM2.66536 4C1.92898 4 1.33203 4.59695 1.33203 5.33333V13.3333C1.33203 14.0697 1.92898 14.6667 2.66536 14.6667H10.6654C11.4017 14.6667 11.9987 14.0697 11.9987 13.3333V5.33333C11.9987 4.59695 11.4017 4 10.6654 4H2.66536Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.3346 12L13.3346 2.66667L4.0013 2.66667L4.0013 1.33333L13.3346 1.33333C14.071 1.33333 14.668 1.93029 14.668 2.66667L14.668 12L13.3346 12Z"
        fill="white"
      />
    </svg>
  );
}

export interface MintProps {
  buttons: { key: string; value: string }[];
  handleChange: (button: Tab) => void;
  active: string;
  block: number | undefined;
}

export default function MintCkBTC({ buttons, handleChange, active, block }: MintProps) {
  const theme = useTheme() as Theme;

  const principal = useAccountPrincipalString();

  const [reload, setReload] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [openTip] = useTips();

  const { result: balance } = useTokenBalance(ckBTC_ID, principal, reload);
  const { result: token } = useTokenInfo(ckBTC_ID);

  const { result: btc_address, loading } = useBTCDepositAddress(principal);

  const updateBalance = useUpdateBalanceCallback();

  const handelUpdateBalance = async () => {
    if (!principal) return;
    setBalanceLoading(true);
    const { status, message } = await updateBalance(principal, undefined);
    if (status === ResultStatus.OK) {
      openTip(t`Update successfully`, MessageTypes.success);
      setReload(!reload);
    } else {
      openTip(message ?? t`Failed to update`, MessageTypes.error);
    }
    setBalanceLoading(false);
  };

  const copyRef = useRef<CopyRef>(null);

  const handleCopy = () => {
    if (copyRef) {
      copyRef?.current?.copy();
    }
  };

  return (
    <>
      <MainCard
        sx={{
          padding: "40px",
          "@media(max-width: 980px)": {
            padding: "20px",
          },
        }}
      >
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              display: "grid",
              gap: "0 12px",
              gridTemplateColumns: "564px auto",
              "@media(max-width: 980px)": {
                gridTemplateColumns: "minmax(100%, 564px)",
                gap: "12px 0",
              },
            }}
          >
            <Box
              sx={{
                maxWidth: "564px",
                width: "100%",
              }}
            >
              <MainContent buttons={buttons} onChange={handleChange} active={active}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "180px" }}>
                      <CircularProgress />
                    </Box>
                  ) : !btc_address ? (
                    <Typography sx={{ margin: "10px 0 0 0" }}>
                      <Trans>No BTC Deposit Address</Trans>
                    </Typography>
                  ) : (
                    <>
                      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                        <Box
                          sx={{
                            width: "160px",
                            height: "160px",
                            padding: "16px",
                            border: `1px solid ${theme.palette.background.level3}`,
                            display: "flex",
                            justifyContent: "center",
                            borderRadius: "8px",
                          }}
                        >
                          <QRCode value={btc_address ?? ""} />
                        </Box>
                      </Box>

                      <Box sx={{ margin: "24px 0 0 0" }}>
                        <Typography>
                          <Trans>BTC Deposit Address</Trans>
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          margin: "10px 0 0 0",
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: "0 10px",
                        }}
                      >
                        <Typography
                          sx={{ color: "text.primary", cursor: "pointer", fontWeight: 500 }}
                          onClick={handleCopy}
                        >
                          {btc_address}
                        </Typography>

                        <Box
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                          onClick={handleCopy}
                        >
                          <CopyIcon />
                        </Box>

                        <Copy content={btc_address} ref={copyRef} />
                      </Box>
                    </>
                  )}

                  <Box
                    sx={{
                      margin: "30px 0 0 0",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <Typography sx={{ flex: "1" }}>
                      <Trans>Minimum Minting Amount</Trans>
                    </Typography>

                    <Typography>
                      <Trans>0.001 ckBTC</Trans>
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      margin: "10px 0 0 0",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <Typography sx={{ flex: "1" }}>
                      <Trans>KYT Fee</Trans>
                    </Typography>

                    <Typography>
                      <Trans>0.00002 ckBTC</Trans>
                    </Typography>
                  </Box>

                  <Links />
                </Box>
              </MainContent>
            </Box>

            <Box
              sx={{
                "@media(max-width: 980px)": {
                  gridArea: "1 / auto",
                },
              }}
            >
              <LogosWrapper>
                <Logo type="mint" />

                <Box sx={{ margin: "32px 0 0 0", display: "grid", gridTemplateColumns: "1fr", gap: "10px 0" }}>
                  <Box sx={{ display: "flex", gap: "0 4px", alignItems: "center" }}>
                    <Typography fontSize="16px">
                      <Trans>Balance</Trans>
                    </Typography>

                    <Box
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={handelUpdateBalance}
                    >
                      <RefreshIcon fill="#ffffff" />
                    </Box>
                  </Box>

                  <Typography color="text.primary" fontSize="18px" fontWeight={600}>
                    {balance && !balanceLoading ? parseTokenAmount(balance, token?.decimals).toFormat() : "--"}{" "}
                    <Typography component="span" fontSize="16px">
                      ckBTC
                    </Typography>
                  </Typography>
                </Box>
              </LogosWrapper>
            </Box>
          </Box>
        </Box>
      </MainCard>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Transaction address={btc_address} block={block} />
      </Box>
    </>
  );
}
