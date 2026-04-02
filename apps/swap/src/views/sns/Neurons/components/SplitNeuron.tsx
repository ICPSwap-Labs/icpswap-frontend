import { uint8ArrayToBigInt } from "@dfinity/utils";
import { splitNeuron } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import type { NervousSystemParameters } from "@icpswap/types";
import {
  BigNumber,
  formatDollarAmount,
  formatTokenAmount,
  parseTokenAmount,
  toSignificantWithGroupSeparator,
} from "@icpswap/utils";
import { MaxButton, Modal, NumberFilledTextField } from "components/index";
import { Box, Button, CircularProgress, Grid, InputAdornment, Typography } from "components/Mui";
import { useUSDPriceById } from "hooks/index";
import { TIP_ERROR, TIP_SUCCESS, useFullscreenLoading, useTips } from "hooks/useTips";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
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

  const handleSubmit = useCallback(async () => {
    if (loading || !amount || !token || !governance_id || !neuron_id) return;

    setLoading(true);
    openFullscreenLoading();

    const nonceBytes = crypto.getRandomValues(new Uint8Array(8));
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
        openTip(t("nns.split.neuron.success"), TIP_SUCCESS);
        if (onSplitSuccess) onSplitSuccess();
      } else {
        const message = split_neuron_error.error_message;
        openTip(message !== "" ? message : t("nns.split.neuron.failed"), TIP_ERROR);
      }
    } else {
      openTip(message ?? t("nns.split.neuron.failed"), TIP_ERROR);
    }

    setLoading(false);
    closeFullscreenLoading();
  }, [
    amount,
    governance_id,
    neuron_id,
    token,
    loading,
    openFullscreenLoading,
    closeFullscreenLoading,
    openTip,
    t,
    onSplitSuccess,
  ]);

  const handleMax = useCallback(
    (event: React.MouseEvent<HTMLParagraphElement>) => {
      event.stopPropagation();

      if (!token || !neuron_minimum_stake) return;

      setAmount(
        parseTokenAmount(
          new BigNumber(neuron_stake.toString())
            .minus(neuron_minimum_stake.toString())
            .minus(token.transFee.toString()),
          token.decimals,
        ).toString(),
      );
    },
    [neuron_stake, neuron_minimum_stake, token],
  );

  let error: string | undefined;

  if (amount === undefined) error = t("common.enter.input.amount");
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
        {`${t("nns.neuron.split")}`}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title={`${t("nns.neuron.split")}`}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px 0" }}>
          <NumberFilledTextField
            placeholder={t("common.enter.input.amount")}
            value={amount}
            onChange={(value: string) => setAmount(value)}
            fullWidth
            numericProps={{
              allowNegative: false,
              decimalScale: token?.decimals,
            }}
            autoComplete="off"
            textFieldProps={{
              slotProps: {
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <MaxButton onClick={handleMax} />
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                  inputProps: {
                    maxLength: 100,
                  },
                },
              },
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
