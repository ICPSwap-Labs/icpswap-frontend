import { Box, Button, CircularProgress, Typography, useTheme } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import QRCode from "components/qrcode";
import { useBTCDepositAddress, useUpdateBalanceCallback } from "hooks/ck-btc/useBTCCalls";
import { useAccountPrincipalString } from "store/auth/hooks";
import Copy from "components/Copy";
import { useState } from "react";
import { ckBTC_ID } from "constants/ckBTC";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { parseTokenAmount } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { useTips, MessageTypes } from "hooks/useTips";
import { MainCard, TabPanel, type Tab } from "components/index";
import Transaction from "./Transaction";
import Links from "./Links";
import Logo from "./Logo";

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

  return (
    <>
      <MainCard>
        <TabPanel tabs={buttons} onChange={handleChange} active={active} />
        <Box sx={{ margin: "20px 0 0 0" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Logo type="mint" />

            <Box
              sx={{
                margin: "20px 0 0 0",
                display: "flex",
                gap: "0 10px",
                alignItems: "center",
              }}
            >
              <Typography color="#fff">
                <Trans>Balance:</Trans>
                &nbsp;{parseTokenAmount(balance, token?.decimals).toFormat()} ckBTC
              </Typography>

              <Button variant="outlined" size="small" disabled={balanceLoading} onClick={handelUpdateBalance}>
                {balanceLoading ? <CircularProgress size={18} sx={{ margin: "0 5px 0 0", color: "inherit" }} /> : null}
                <Trans>Update</Trans>
              </Button>
            </Box>

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
                <Box sx={{ background: theme.palette.background.level4, margin: "30px 0 0 0", padding: "10px" }}>
                  <Typography>
                    <Trans>BTC Deposit Address</Trans>
                  </Typography>

                  <Box sx={{ margin: "15px 0 0 0", display: "flex", justifyContent: "center" }}>
                    <QRCode value={btc_address ?? ""} />
                  </Box>
                </Box>

                <Box sx={{ margin: "10px 0 0 0", display: "flex", alignItems: "center", gap: "0 10px" }}>
                  <Copy content={btc_address}>
                    <Typography color="#fff" fontWeight={500}>
                      {btc_address}
                    </Typography>
                  </Copy>
                  <Copy content={btc_address}>
                    <CopyIcon />
                  </Copy>
                </Box>
              </>
            )}

            <Box
              sx={{
                margin: "30px 0 0 0",
                display: "flex",
                width: "360px",
                "@media(max-width:640px)": { width: "320px" },
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
                width: "360px",
                "@media(max-width:640px)": { width: "320px" },
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
        </Box>
      </MainCard>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Transaction address={btc_address} block={block} />
      </Box>
    </>
  );
}
