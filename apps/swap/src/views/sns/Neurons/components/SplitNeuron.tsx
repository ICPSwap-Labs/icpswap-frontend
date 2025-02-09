import React, { useMemo, useState } from "react";
import { Button, Grid, Typography, Box, InputAdornment, CircularProgress } from "components/Mui";
import {
  parseTokenAmount,
  formatTokenAmount,
  uint8ArrayToBigInt,
  toSignificantWithGroupSeparator,
  formatDollarAmount,
  BigNumber,
} from "@icpswap/utils";
import { splitNeuron } from "@icpswap/hooks";
import type { NervousSystemParameters } from "@icpswap/types";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { Modal, NumberFilledTextField } from "components/index";
import MaxButton from "components/MaxButton";
import randomBytes from "randombytes";
import { useUSDPriceById } from "hooks/index";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

export interface SplitNeuronProps {
  open: boolean;
  onClose: () => void;
  onSplitSuccess?: () => void;
  token: Token | undefined;
  neuron_stake: bigint;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  neuronSystemParameters: NervousSystemParameters | undefined;
  disabled?: boolean;
}

export function SplitNeuron({
  onSplitSuccess,
  neuron_stake,
  token,
  governance_id,
  neuron_id,
  neuronSystemParameters,
  disabled,
}: SplitNeuronProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const tokenUSDPrice = useUSDPriceById(token?.address);

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

  if (amount === undefined) error = t("common.error.input.amount");
  if (token === undefined) error = t("common.error.unknown");

  if (
    amount &&
    token &&
    neuron_minimum_stake &&
    new BigNumber(amount)
      .plus(parseTokenAmount(neuron_minimum_stake + BigInt(token.transFee), token.decimals))
      .isGreaterThan(parseTokenAmount(neuron_stake, token.decimals))
  )
    error = t("common.error.amount.large");
  if (
    amount &&
    token &&
    !new BigNumber(amount).minus(parseTokenAmount(token.transFee, token.decimals)).isGreaterThan(0)
  )
    error = t("common.error.amount.greater.than", {
      amount: "trans fee",
    });

  if (
    amount &&
    token &&
    neuron_minimum_stake &&
    !formatTokenAmount(amount, token.decimals)
      .minus(token.transFee.toString())
      .isGreaterThan(neuron_minimum_stake?.toString())
  )
    error = t("common.error.amount.greater.than", {
      amount: `${parseTokenAmount(neuron_minimum_stake + BigInt(token.transFee), token.decimals).toFormat()} ${
        token.symbol
      }`,
    });

  const canSplit = useMemo(() => {
    const neuron_minimum_stake_e8s = neuronSystemParameters?.neuron_minimum_stake_e8s[0];

    if (!neuron_minimum_stake_e8s) return false;

    return new BigNumber(neuron_stake.toString()).isGreaterThan((neuron_minimum_stake_e8s * BigInt(2)).toString());
  }, [neuron_stake, neuronSystemParameters]);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" size="small" disabled={!canSplit || disabled}>
        {t("nns.neuron.split")}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title={t("nns.neuron.split")}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px 0" }}>
          <NumberFilledTextField
            placeholder={t("common.error.input.amount")}
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
              {token && tokenUSDPrice
                ? t("common.balance.colon.amount", {
                    amount: `${toSignificantWithGroupSeparator(
                      parseTokenAmount(neuron_stake, token.decimals).toFixed(token.decimals > 8 ? 8 : token.decimals),
                    )} ${token.symbol} (${formatDollarAmount(
                      parseTokenAmount(neuron_stake, token.decimals).multipliedBy(tokenUSDPrice).toString(),
                    )})`,
                  })
                : "--"}
            </Typography>
          </Grid>
          <Typography>
            {token
              ? t("common.fee.colon.amount", {
                  amount: `${parseTokenAmount(token.transFee.toString(), token.decimals).toFormat()} ${token.symbol}`,
                })
              : "--"}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !!error}
            onClick={handleSubmit}
            startIcon={loading ? <CircularProgress size={26} color="inherit" /> : null}
          >
            {error || t("common.confirm")}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
