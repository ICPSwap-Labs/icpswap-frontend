import React, { useMemo, useState } from "react";
import { Button, Grid, Typography, Box, InputAdornment } from "@mui/material";
import { parseTokenAmount, formatTokenAmount, uint8ArrayToBigInt } from "@icpswap/utils";
import { claimOrRefreshNeuron, claimOrRefreshNeuronFromAccount } from "@icpswap/hooks";
import { tokenTransfer } from "hooks/token/calls";
import BigNumber from "bignumber.js";
import CircularProgress from "@mui/material/CircularProgress";
import type { NervousSystemParameters } from "@icpswap/types";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { Trans, t } from "@lingui/macro";
import { TokenInfo } from "types/token";
import { Modal, NumberFilledTextField } from "components/index";
import MaxButton from "components/MaxButton";
import { useTokenBalance } from "hooks/token";
import { useAccountPrincipal } from "store/auth/hooks";
import { SubAccount } from "@dfinity/ledger-icp";

export interface StakeProps {
  open: boolean;
  onClose: () => void;
  onStakeSuccess?: () => void;
  token: TokenInfo | undefined;
  neuron_stake: bigint;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
}

export function Stake({ onStakeSuccess, neuron_stake, token, governance_id, neuron_id }: StakeProps) {
  const principal = useAccountPrincipal();
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const { result: balance } = useTokenBalance(token?.canisterId, principal);

  const handleSubmit = async () => {
    if (loading || !amount || !principal || !token || !governance_id || !neuron_id) return;

    setLoading(true);
    openFullscreenLoading();

    const { message, status } = await tokenTransfer({
      canisterId: token.canisterId,
      to: governance_id,
      subaccount: [...neuron_id],
      amount: formatTokenAmount(amount, token.decimals),
      from: principal.toString(),
      identity: true,
    });

    if (status === "ok") {
      const refreshCommand = await claimOrRefreshNeuron(governance_id, neuron_id);
      openTip(t`Staked successfully`, TIP_SUCCESS);
      if (onStakeSuccess) onStakeSuccess();
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
  if (amount === undefined) error = t`Enter the amount`;
  if (token === undefined) error = t`Some unknown error happened`;
  if (
    amount &&
    token &&
    balance &&
    parseTokenAmount(balance.minus(token.transFee.toString()), token.decimals).isLessThan(amount)
  )
    error = t`There are not enough funds in this account`;

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" size="small">
        <Trans>Stake</Trans>
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title={t`Increase Neuron Stake`}>
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
                <Trans>Fee:</Trans>
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
