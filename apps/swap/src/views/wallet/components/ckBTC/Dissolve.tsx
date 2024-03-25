import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { useBTCWithdrawAddress, useFetchUserTxStates } from "hooks/ck-btc/useBTCCalls";
import { retrieveBTC, useApprove } from "hooks/ck-btc";
import { useAccountPrincipalString } from "store/auth/hooks";
import { ckBTC_ID, DISSOLVE_FEE } from "constants/ckBTC";
import { useState, useMemo } from "react";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { FilledTextField, NumberFilledTextField , MainCard } from "components/index";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { parseTokenAmount, formatTokenAmount, numberToString } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import Identity, { CallbackProps } from "components/Identity";
import { ResultStatus } from "@icpswap/types";
import { validate } from "bitcoin-address-validation";
import { MessageTypes, useTips } from "hooks/useTips";
import Toggle, { ToggleButton } from "components/SwitchToggle";
import { useUpdateUserTx } from "store/wallet/hooks";
import Links from "./Links";
import Logo from "./Logo";
import DissolveRecords from "./DissolveRecords";
import RetryDissolve from "./Retry";

export default function DissolveBTC({
  buttons,
  handleChange,
  active,
}: {
  buttons: { key: string; value: string }[];
  handleChange: (button: ToggleButton) => void;
  active: string;
}) {
  const principal = useAccountPrincipalString();

  const [reload, setReload] = useState(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  const [retryDissolveOpen, setRetryDissolveOpen] = useState(false);

  const { result: ckBTCBalance, loading: balanceLoading } = useTokenBalance(ckBTC_ID, principal, reload);
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
    if (!token) return;
    setAmount(
      parseTokenAmount(ckBTCBalance, token?.decimals)
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
      <MainCard>
        <Toggle buttons={buttons} onChange={handleChange} active={active} />
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px 0 0 0" }}>
          <Logo type="dissolve" />

          <Box
            sx={{
              margin: "20px 0 0 0",
              display: "flex",
              gap: "0 10px",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography color="#fff">
                <Trans>Balance:</Trans>
                &nbsp;{parseTokenAmount(ckBTCBalance, token?.decimals).toFormat()} ckBTC
              </Typography>
            </Box>

            <Button variant="outlined" size="small" disabled={balanceLoading} onClick={() => setReload(!reload)}>
              <Trans>Update</Trans>
            </Button>
          </Box>

          <Box
            sx={{
              margin: "20px 0 0 0",
              display: "flex",
              gap: "0 10px",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography color="#fff">
              <Trans>Undissolved:</Trans>&nbsp;
              {unDissolvedLoading || !unDissolveBalance
                ? "--"
                : parseTokenAmount(unDissolveBalance, token?.decimals).toFormat()}{" "}
              ckBTC
            </Typography>
            <Button variant="outlined" size="small" onClick={() => setRetryDissolveOpen(true)}>
              <Trans>Redissolve</Trans>
            </Button>
          </Box>

          <Box sx={{ margin: "40px 0 0 0", width: "100%", maxWidth: "474px" }}>
            <Typography color="#fff">
              <Trans>Transfer ckBTC to retrieving account:</Trans>
            </Typography>

            <Typography sx={{ margin: "10px 0 0 0" }}>
              <Typography component="span" color="#D3625B">
                *
              </Typography>
              <Trans>Address:</Trans>
            </Typography>

            <Box sx={{ margin: "15px 0 0 0" }}>
              <FilledTextField
                value={address}
                onChange={(value) => setAddress(value)}
                inputProps={{
                  maxLength: 255,
                }}
              />
            </Box>

            <Typography sx={{ margin: "10px 0 0 0" }}>
              <Typography component="span" color="#D3625B">
                *
              </Typography>
              <Trans>Amount: (includes bitcoin network fees)</Trans>
            </Typography>

            <Box sx={{ margin: "15px 0 0 0" }}>
              <NumberFilledTextField
                value={amount}
                onChange={(value: number) => setAmount(String(value))}
                numericProps={{
                  allowNegative: false,
                  decimalScale: 8,
                  maxLength: 26,
                }}
              />

              <Box sx={{ margin: "5px 0 0 0", display: "flex", justifyContent: "space-between" }}>
                <Typography component="div">
                  <Typography>Dissolve Fee: {DISSOLVE_FEE}ckBTC</Typography>
                  <Typography>
                    <Trans>(Excludes Bitcoin Network Tx fees)</Trans>
                  </Typography>
                </Typography>
                <Typography color="secondary" sx={{ cursor: "pointer" }} onClick={handleMax}>
                  <Trans>Max</Trans>
                </Typography>
              </Box>

              <Box sx={{ width: "100%", margin: "20px 0 0 0" }}>
                <Identity onSubmit={handleSubmit}>
                  {({ submit }: CallbackProps) => (
                    <Button variant="contained" fullWidth size="large" onClick={submit} disabled={!!error || loading}>
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
      </MainCard>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <DissolveRecords />
      </Box>

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
