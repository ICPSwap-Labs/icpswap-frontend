import { Box, Button, CircularProgress, Typography, InputAdornment } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { withdraw_eth, useFetchUserTxStates } from "hooks/ck-eth";
import { useApprove, useTokenInfo, useTokenBalance } from "hooks/token";
import { useAccountPrincipalString } from "store/auth/hooks";
import { ckETH_MINTER_ID, MIN_WITHDRAW_AMOUNT , chain } from "constants/ckETH";
import { ckETH } from "constants/tokens";
import { useState, useEffect } from "react";
import { FilledTextField, NumberFilledTextField, MainCard } from "components/index";
import { parseTokenAmount, formatTokenAmount, numberToString, toSignificant } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { isAddress } from "utils/web3/index";
import { MessageTypes, useTips } from "hooks/useTips";
import Toggle, { ToggleButton } from "components/SwitchToggle";
import { useUpdateUserWithdrawTx } from "store/web3/hooks";
import { useWeb3React } from "@web3-react/core";
import { RefreshIcon } from "assets/icons/Refresh";
import { chainIdToNetwork } from "constants/web3";

import Logo from "./Logo";
import Links from "./Links";
import DissolveRecords from "./DissolveRecords";

export interface DissolveETHProps {
  buttons: { key: string; value: string }[];
  handleChange: (button: ToggleButton) => void;
  active: string;
}

export default function DissolveETH({ buttons, handleChange, active }: DissolveETHProps) {
  const principal = useAccountPrincipalString();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);

  const { account, chainId } = useWeb3React();

  useEffect(() => {
    if (account) {
      setAddress(account);
    }
  }, [account]);

  const { result: ckETHBalance } = useTokenBalance(ckETH.address, principal, reload);
  const { result: token } = useTokenInfo(ckETH.address);

  const updateUserTx = useUpdateUserWithdrawTx();
  const [openTip] = useTips();
  const approve = useApprove();

  useFetchUserTxStates();

  const handleSubmit = async () => {
    if (!amount || !principal || !token || !address) return;

    const withdraw_amount = BigInt(numberToString(formatTokenAmount(amount, token.decimals)));

    setLoading(true);

    const { status, message } = await approve({
      canisterId: ckETH.address,
      spender: ckETH_MINTER_ID,
      value: withdraw_amount,
      account: principal,
    });

    if (status === ResultStatus.ERROR) {
      openTip(message ?? t`Failed to approve ckETH`, MessageTypes.error);
      setLoading(false);
      return;
    }

    const { status: status1, message: message1, data } = await withdraw_eth(address, withdraw_amount);

    if (status1 === ResultStatus.ERROR) {
      openTip(message1 ?? t`Transaction for dissolving ckETH failed to submit`, MessageTypes.error);
    } else {
      setAmount("");
      openTip("ckETH dissolution transaction submitted: Awaiting completion.", MessageTypes.success);
      if (data?.block_index) {
        updateUserTx(principal, data.block_index, undefined, withdraw_amount.toString());
      }
      setReload(!reload);
    }

    setLoading(false);
  };

  const handleMax = () => {
    if (!token) return;
    setAmount(
      parseTokenAmount(ckETHBalance, token?.decimals)
        .minus(parseTokenAmount(token.transFee, token.decimals))
        .toFixed(token.decimals - 1),
    );
  };

  let error = "";

  if (!amount) error = t`Enter the amount`;
  if (amount && formatTokenAmount(amount, ckETH.decimals).isLessThan(MIN_WITHDRAW_AMOUNT))
    error = `Min amount is ${toSignificant(parseTokenAmount(MIN_WITHDRAW_AMOUNT, ckETH.decimals).toString())} ckETH`;
  if (address && isAddress(address) === false) error = t`Invalid ethereum address`;
  if (
    amount &&
    token &&
    ckETHBalance &&
    !formatTokenAmount(amount, ckETH.decimals).plus(token.transFee.toString()).isLessThan(ckETHBalance)
  )
    error = t`Insufficient Balance`;
  if (!!chainId && chain !== chainId) error = `Please switch to ${chainIdToNetwork[chain]}`;
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
                &nbsp;{toSignificant(parseTokenAmount(ckETHBalance, token?.decimals).toNumber())} ckETH
              </Typography>
            </Box>

            <Box
              sx={{
                cursor: "pointer",
              }}
              onClick={() => setReload(!reload)}
            >
              <RefreshIcon fill="rgb(86, 105, 220)" />
            </Box>
          </Box>

          <Box sx={{ margin: "40px 0 0 0", width: "100%", maxWidth: "474px" }}>
            <Typography color="#fff">
              <Trans>Transfer ckETH to retrieving account:</Trans>
            </Typography>

            <Typography sx={{ margin: "10px 0 0 0" }}>
              <Typography component="span" color="#D3625B">
                *
              </Typography>
              <Trans>ETH (Ethereum Mainnet) address:</Trans>
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
              <Trans>Amount: (includes Ethereum network fees)</Trans>
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Typography>ckETH</Typography>
                      <Typography color="secondary" sx={{ cursor: "pointer", margin: "0 0 0 5px" }} onClick={handleMax}>
                        <Trans>Max</Trans>
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ margin: "5px 0 0 0", display: "flex", justifyContent: "space-between" }}>
                <Typography>
                  Important: Please enter the address of a non-custodial wallet only. Avoid using deposit addresses from
                  centralized exchanges (CEX) like Binance or Coinbase. Using a CEX address could result in the loss of
                  your Ethereum (ETH) in the event of any discrepancies or exceptions.
                </Typography>
              </Box>

              <Box sx={{ width: "100%", margin: "20px 0 0 0" }}>
                <Button variant="contained" fullWidth size="large" onClick={handleSubmit} disabled={!!error || loading}>
                  {loading ? <CircularProgress color="inherit" size={22} sx={{ margin: "0 5px 0 0" }} /> : null}
                  {error || <Trans>Dissolve ckETH</Trans>}
                </Button>
              </Box>
            </Box>
          </Box>

          <Links />
        </Box>
      </MainCard>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <DissolveRecords />
      </Box>
    </>
  );
}
