import React, { useMemo, useState } from "react";
import { Button, Grid, Typography, Box, InputAdornment } from "@mui/material";
import { parseTokenAmount, formatTokenAmount, uint8ArrayToBigInt } from "@icpswap/utils";
import { claimOrRefreshNeuronFromAccount } from "@icpswap/hooks";
import { tokenTransfer } from "hooks/token/calls";
import BigNumber from "bignumber.js";
import CircularProgress from "@mui/material/CircularProgress";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { Trans, t } from "@lingui/macro";
import { TokenInfo } from "types/token";
import type { NervousSystemParameters } from "@icpswap/types";
import { Modal, NumberFilledTextField } from "components/index";
import MaxButton from "components/MaxButton";
import { useTokenBalance } from "hooks/token";
import { useAccountPrincipal } from "store/auth/hooks";
import { SubAccount } from "@dfinity/ledger-icp";
import randomBytes from "randombytes";
import { buildNeuronStakeSubAccount } from "utils/sns/neurons";

export interface StakeProps {
  onStakeSuccess?: () => void;
  token: TokenInfo | undefined;
  governance_id: string | undefined;
  neuronSystemParameters: NervousSystemParameters | undefined;
}

export function StakeToCreateNeuron({ onStakeSuccess, token, governance_id, neuronSystemParameters }: StakeProps) {
  const principal = useAccountPrincipal();
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const { result: balance } = useTokenBalance(token?.canisterId, principal);

  const { neuron_minimum_stake_e8s } = useMemo(() => {
    if (!neuronSystemParameters) return {};

    return {
      neuron_minimum_stake_e8s: neuronSystemParameters.neuron_minimum_stake_e8s[0],
    };
  }, [neuronSystemParameters]);

  const handleClose = () => {
    setOpen(false);
    setAmount("");
  };

  const handleSubmit = async () => {
    if (loading || !amount || !principal || !token || !governance_id) return;

    setLoading(true);
    openFullscreenLoading();

    const nonceBytes = new Uint8Array(randomBytes(8));
    const subaccount = buildNeuronStakeSubAccount(nonceBytes, principal);

    const { message, status } = await tokenTransfer({
      canisterId: token.canisterId,
      to: governance_id,
      subaccount: [...subaccount.toUint8Array()],
      amount: formatTokenAmount(amount, token.decimals),
      from: principal.toString(),
      memo: [...nonceBytes],
    });

    if (status === "ok") {
      const refreshSub = SubAccount.fromPrincipal(principal);
      const memo = uint8ArrayToBigInt(nonceBytes);
      const { status, message, data } = await claimOrRefreshNeuronFromAccount(governance_id, principal, memo, [
        ...refreshSub.toUint8Array(),
      ]);

      const result = data ? data.command[0] : undefined;
      const command_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

      if (status === "ok") {
        if (!command_error) {
          openTip(t`Staked successfully`, TIP_SUCCESS);
          if (onStakeSuccess) onStakeSuccess();
          handleClose();
        } else {
          const message = command_error.error_message;
          openTip(message !== "" ? message : t`Failed to stake`, TIP_ERROR);
        }
      } else {
        openTip(message !== "" ? message : t`Failed to stake`, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to stake`, TIP_ERROR);
    }

    setLoading(false);
    closeFullscreenLoading();
  };

  const handleMax = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.stopPropagation();
    if (!token || !balance) return;
    setAmount(parseTokenAmount(balance.minus(token.transFee.toString()), token.decimals).toString());
  };

  let error: string | undefined;
  if (!amount) error = t`Enter the amount`;
  if (token === undefined) error = t`Some unknown error happened`;
  if (
    amount &&
    token &&
    balance &&
    parseTokenAmount(balance.minus(token.transFee.toString()), token.decimals).isLessThan(amount)
  )
    error = t`There are not enough funds in this account`;

  if (amount && neuron_minimum_stake_e8s && parseTokenAmount(neuron_minimum_stake_e8s, 8).isGreaterThan(amount))
    error = t`At least ${parseTokenAmount(neuron_minimum_stake_e8s, 8).toString()} ${token?.symbol}`;

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" size="small">
        <Trans>Stake</Trans>
      </Button>

      <Modal open={open} onClose={handleClose} title={t`Create Neuron Stake`}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px 0" }}>
          <NumberFilledTextField
            placeholder={t`Enter the amount`}
            value={amount}
            onChange={(value: string) => setAmount(value)}
            fullWidth
            numericProps={{
              allowNegative: false,
              decimalScale: token?.decimals,
            }}
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MaxButton onClick={handleMax} />
                </InputAdornment>
              ),
            }}
          />

          <Grid container alignItems="center">
            <Typography>
              {token && balance ? (
                <Trans>
                  Balance:&nbsp;
                  {`${new BigNumber(
                    parseTokenAmount(balance, token.decimals).toFixed(token.decimals > 8 ? 8 : token.decimals),
                  ).toFormat()}`}
                </Trans>
              ) : (
                "--"
              )}
            </Typography>
          </Grid>
          <Typography>
            {token ? (
              <>
                <Trans>Fee:</Trans>&nbsp;
                {parseTokenAmount(token.transFee.toString(), token.decimals).toFormat()}&nbsp;
                {token.symbol}
              </>
            ) : (
              "--"
            )}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || error !== undefined}
            onClick={handleSubmit}
            startIcon={loading ? <CircularProgress size={26} color="inherit" /> : null}
          >
            {error || <Trans>Confirm</Trans>}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
