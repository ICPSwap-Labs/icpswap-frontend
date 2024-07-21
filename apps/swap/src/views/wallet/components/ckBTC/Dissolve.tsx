import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { useBTCWithdrawAddress, useFetchUserTxStates } from "hooks/ck-btc/useBTCCalls";
import { retrieveBTC, useApprove } from "hooks/ck-btc";
import { useAccountPrincipalString } from "store/auth/hooks";
import { ckBTC_ID, DISSOLVE_FEE } from "constants/ckBTC";
import { useState, useMemo } from "react";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { FilledTextField, NumberFilledTextField, type Tab } from "components/index";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { parseTokenAmount, formatTokenAmount, numberToString } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import Identity, { CallbackProps } from "components/Identity";
import { ResultStatus } from "@icpswap/types";
import { validate } from "bitcoin-address-validation";
import { MessageTypes, useTips } from "hooks/useTips";
import { useUpdateUserTx } from "store/wallet/hooks";
import { RefreshIcon } from "assets/icons/Refresh";
import { InputAdornment } from "components/Mui";

import Links from "./Links";
import Logo from "./Logo";
import DissolveRecords from "./DissolveRecords";
import RetryDissolve from "./Retry";
import { Wrapper } from "../ckTokens/Wrapper";
import { MainContent } from "../ckTokens/MainContent";
import { LogosWrapper } from "../ckTokens/LogosWrapper";

export interface DissolveBTCProps {
  buttons: { key: string; value: string }[];
  handleChange: (button: Tab) => void;
  active: string;
}

export default function DissolveBTC({ buttons, handleChange, active }: DissolveBTCProps) {
  const principal = useAccountPrincipalString();

  const [reload, setReload] = useState(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  const [retryDissolveOpen, setRetryDissolveOpen] = useState(false);

  const { result: ckBTCBalance } = useTokenBalance(ckBTC_ID, principal, reload);
  const { result: token } = useTokenInfo(ckBTC_ID);

  const updateUserTx = useUpdateUserTx();

  useFetchUserTxStates();

  const [openTip] = useTips();

  const { result: btc_withdraw_address } = useBTCWithdrawAddress();

  const withdrawAddress = useMemo(
    () => ({
      owner: btc_withdraw_address?.owner,
      sub: btc_withdraw_address?.subaccount ? btc_withdraw_address?.subaccount[0] : undefined,
    }),
    [JSON.stringify(btc_withdraw_address)],
  );

  const { result: unDissolveBalance, loading: unDissolvedLoading } = useTokenBalance(
    ckBTC_ID,
    withdrawAddress.owner,
    true,
    withdrawAddress.sub,
  );

  const approve = useApprove();

  const handleSubmit = async () => {
    if (!amount || !principal || !token || !address || !btc_withdraw_address) return;

    const approveAmount = BigInt(numberToString(formatTokenAmount(amount, token.decimals)));

    setLoading(true);

    const { status, message } = await approve({ amount: approveAmount });

    if (status === ResultStatus.ERROR) {
      openTip(message ?? t`Failed to approve ckBTC`, MessageTypes.error);
      setLoading(false);
      return;
    }

    const { status: status1, message: message1, data } = await retrieveBTC(address, approveAmount);

    if (status1 === ResultStatus.ERROR) {
      openTip(message1 ?? t`Failed to dissolve`, MessageTypes.error);
    } else {
      openTip("Dissolve successfully", MessageTypes.success);
      if (data?.block_index) {
        updateUserTx(principal, data.block_index, undefined, approveAmount.toString());
      }
      setReload(!reload);
      setAmount(undefined);
      setAddress(undefined);
    }

    setLoading(false);
  };

  const handleMax = () => {
    if (!token || !ckBTCBalance) return;

    setAmount(
      parseTokenAmount(ckBTCBalance, token.decimals)
        .minus(parseTokenAmount(token.transFee, token.decimals))
        .toFixed(token.decimals - 1),
    );
  };

  let error = "";
  if (address && !validate(address)) error = t`Invalid bitcoin address`;
  if (!amount) error = t`Enter the amount`;
  if (amount && !new BigNumber(amount).isGreaterThan(0.001)) error = t`Min amount is 0.001 ckBTC`;
  if (!address) error = t`Enter the address`;

  return (
    <>
      <Wrapper
        main={
          <MainContent buttons={buttons} onChange={handleChange} active={active}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ width: "100%" }}>
                <Typography sx={{ color: "text.primary", fontSize: "16px" }}>
                  <Trans>Transfer ckBTC to retrieving account:</Trans>
                </Typography>

                <Typography sx={{ margin: "12px 0 0 0" }} fontSize="16px">
                  <Typography component="span" color="#D3625B" fontSize="16px">
                    *
                  </Typography>
                  <Trans>Address:</Trans>
                </Typography>

                <Box sx={{ margin: "12px 0 0 0" }}>
                  <FilledTextField
                    value={address}
                    onChange={(value) => setAddress(value)}
                    placeholder="Enter the address"
                    inputProps={{
                      maxLength: 255,
                    }}
                    multiline
                  />
                </Box>

                <Typography sx={{ margin: "24px 0 0 0" }} fontSize="16px">
                  <Typography component="span" color="#D3625B" fontSize="16px">
                    *
                  </Typography>
                  <Trans>Amount: (includes bitcoin network fees)</Trans>
                </Typography>

                <Box sx={{ margin: "12px 0 0 0" }}>
                  <NumberFilledTextField
                    placeholder="0.00"
                    value={amount}
                    onChange={(value: number) => setAmount(String(value))}
                    numericProps={{
                      allowNegative: false,
                      decimalScale: 8,
                      maxLength: 26,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <Typography color="text.primary" fontSize="16px">
                            ckBTC
                          </Typography>
                          <Typography
                            color="secondary"
                            sx={{ cursor: "pointer", margin: "0 0 0 5px" }}
                            onClick={handleMax}
                            fontSize="16px"
                          >
                            <Trans>Max</Trans>
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ margin: "5px 0 0 0", display: "flex", justifyContent: "space-between" }}>
                    <Typography component="div">
                      <Typography>Dissolve Fee: {DISSOLVE_FEE}ckBTC</Typography>
                      <Typography>
                        <Trans>(Excludes Bitcoin Network Tx fees)</Trans>
                      </Typography>
                    </Typography>
                  </Box>

                  <Box sx={{ width: "100%", margin: "32px 0 0 0" }}>
                    <Identity onSubmit={handleSubmit}>
                      {({ submit }: CallbackProps) => (
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          onClick={submit}
                          disabled={!!error || loading}
                        >
                          {loading ? <CircularProgress color="inherit" size={22} sx={{ margin: "0 5px 0 0" }} /> : null}
                          {error || <Trans>Dissolve ckBTC</Trans>}
                        </Button>
                      )}
                    </Identity>
                  </Box>
                </Box>
              </Box>

              <Links />
            </Box>
          </MainContent>
        }
        logo={
          <LogosWrapper>
            <Logo type="dissolve" />
            <Box sx={{ margin: "32px 0 0 0" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "0 10px" }}>
                <Typography fontSize="16px">
                  <Trans>Balance</Trans>
                </Typography>

                <Box
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => setReload(!reload)}
                >
                  <RefreshIcon fill="#ffffff" />
                </Box>
              </Box>

              <Typography
                sx={{
                  margin: "5px 0 0 0",
                  color: "text.primary",
                  fontWeight: 600,
                  fontSize: "18px",
                }}
              >
                {parseTokenAmount(ckBTCBalance, token?.decimals).toFormat()}
                <Typography component="span" fontSize="16px">
                  &nbsp;ckBTC
                </Typography>
              </Typography>
            </Box>

            <Box
              sx={{
                margin: "24px 0 0 0",
              }}
            >
              <Typography fontSize="16px">
                <Trans>Undissolved</Trans>&nbsp;
              </Typography>
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: "18px",
                  fontWeight: 600,
                  margin: "5px 0 0 0",
                }}
              >
                {unDissolvedLoading || !unDissolveBalance
                  ? "--"
                  : parseTokenAmount(unDissolveBalance, token?.decimals).toFormat()}{" "}
                <Typography component="span" fontSize="16px">
                  &nbsp;ckBTC
                </Typography>
              </Typography>

              <Button
                sx={{ margin: "5px 0 0 0" }}
                variant="outlined"
                size="small"
                onClick={() => setRetryDissolveOpen(true)}
              >
                <Trans>Redissolve</Trans>
              </Button>
            </Box>
          </LogosWrapper>
        }
        transactions={<DissolveRecords />}
      />

      {retryDissolveOpen ? (
        <RetryDissolve
          token={token}
          unDissolveBalance={unDissolveBalance}
          open={retryDissolveOpen}
          onClose={() => setRetryDissolveOpen(false)}
        />
      ) : null}
    </>
  );
}
