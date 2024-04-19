import React, { useMemo, useState } from "react";
import { Button, Grid, Typography, Box, InputAdornment } from "@mui/material";
import { parseTokenAmount, formatTokenAmount, uint8ArrayToBigInt } from "@icpswap/utils";
import { splitNeuron } from "@icpswap/hooks";
import BigNumber from "bignumber.js";
import CircularProgress from "@mui/material/CircularProgress";
import type { NervousSystemParameters } from "@icpswap/types";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { Trans, t } from "@lingui/macro";
import { TokenInfo } from "types/token";
import { Modal, NumberFilledTextField } from "components/index";
import MaxButton from "components/MaxButton";
import randomBytes from "randombytes";

export interface SplitNeuronProps {
  open: boolean;
  onClose: () => void;
  onSplitSuccess?: () => void;
  token: TokenInfo | undefined;
  neuron_stake: bigint;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  neuronSystemParameters: NervousSystemParameters | undefined;
}

export function SplitNeuron({
  onSplitSuccess,
  neuron_stake,
  token,
  governance_id,
  neuron_id,
  neuronSystemParameters,
}: SplitNeuronProps) {
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const neuron_minimum_stake = useMemo(() => {
    if (!neuronSystemParameters) return undefined;

    return neuronSystemParameters.neuron_minimum_stake_e8s[0];
  }, [neuronSystemParameters]);

  const handleSubmit = async () => {
    if (loading || !amount || !token || !governance_id || !neuron_id) return;

    setLoading(true);
    openFullscreenLoading();

    const nonceBytes = new Uint8Array(randomBytes(8));
    const memo = uint8ArrayToBigInt(nonceBytes);

    const { data, message, status } = await splitNeuron(
      governance_id,
      neuron_id,
      BigInt(formatTokenAmount(amount, token.decimals).toString()),
      memo,
    );

    const result = data ? data.command[0] : undefined;
    const split_neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

    if (status === "ok") {
      if (!split_neuron_error) {
        openTip(t`Split successfully`, TIP_SUCCESS);
        if (onSplitSuccess) onSplitSuccess();
      } else {
        const message = split_neuron_error.error_message;
        openTip(message !== "" ? message : t`Failed to split`, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to split`, TIP_ERROR);
    }

    setLoading(false);
    closeFullscreenLoading();
  };

  const handleMax = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.stopPropagation();

    if (!token || !neuron_minimum_stake) return;

    setAmount(
      parseTokenAmount(
        new BigNumber(neuron_stake.toString()).minus(neuron_minimum_stake.toString()).minus(token.transFee.toString()),
        token.decimals,
      ).toString(),
    );
  };

  let error: string | undefined;

  if (amount === undefined) error = t`Enter the amount`;
  if (token === undefined) error = t`Some unknown error happened`;

  if (
    amount &&
    token &&
    neuron_minimum_stake &&
    new BigNumber(amount)
      .plus(parseTokenAmount(neuron_minimum_stake + token.transFee, token.decimals))
      .isGreaterThan(parseTokenAmount(neuron_stake, token.decimals))
  )
    error = t`Amount is too large`;
  if (
    amount &&
    token &&
    !new BigNumber(amount).minus(parseTokenAmount(token.transFee, token.decimals)).isGreaterThan(0)
  )
    error = t`Must be greater than trans fee`;

  if (
    amount &&
    token &&
    neuron_minimum_stake &&
    !formatTokenAmount(amount, token.decimals)
      .minus(token.transFee.toString())
      .isGreaterThan(neuron_minimum_stake?.toString())
  )
    error = t`Amount must be greater than ${parseTokenAmount(
      neuron_minimum_stake + token.transFee,
      token.decimals,
    ).toFormat()} ${token.symbol}`;

  const canSplit = useMemo(() => {
    const neuron_minimum_stake_e8s = neuronSystemParameters?.neuron_minimum_stake_e8s[0];

    if (!neuron_minimum_stake_e8s) return false;

    return new BigNumber(neuron_stake.toString()).isGreaterThan((neuron_minimum_stake_e8s * BigInt(2)).toString());
  }, [neuron_stake, neuronSystemParameters]);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" size="small" disabled={!canSplit}>
        <Trans>Split Neuron</Trans>
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title={t`Split Neuron`}>
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
              {token ? (
                <Trans>
                  Balance:{" "}
                  {`${new BigNumber(
                    parseTokenAmount(neuron_stake, token.decimals).toFixed(token.decimals > 8 ? 8 : token.decimals),
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
            disabled={loading || !!error}
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
