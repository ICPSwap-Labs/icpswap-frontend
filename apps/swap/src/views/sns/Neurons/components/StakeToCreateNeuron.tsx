import React, { useMemo, useState } from "react";
import { Button, Typography, Box, InputAdornment, CircularProgress } from "components/Mui";
import { parseTokenAmount, formatTokenAmount, uint8ArrayToBigInt, formatDollarAmount, BigNumber } from "@icpswap/utils";
import { claimOrRefreshNeuronFromAccount } from "@icpswap/hooks";
import { tokenTransfer } from "hooks/token/calls";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import type { NervousSystemParameters } from "@icpswap/types";
import { Modal, NumberFilledTextField, MaxButton } from "components/index";
import { useTokenBalance } from "hooks/token";
import { useAccountPrincipal } from "store/auth/hooks";
import { SubAccount } from "@dfinity/ledger-icp";
import randomBytes from "randombytes";
import { buildNeuronStakeSubAccount } from "utils/sns/neurons";
import { useUSDPriceById } from "hooks/index";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

export interface StakeProps {
  onStakeSuccess?: () => void;
  token: Token | undefined;
  governance_id: string | undefined;
  neuronSystemParameters: NervousSystemParameters | undefined;
}

export function StakeToCreateNeuron({ onStakeSuccess, token, governance_id, neuronSystemParameters }: StakeProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const tokenUSDPrice = useUSDPriceById(token?.address);
  const { result: balance } = useTokenBalance(token?.address, principal);

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
      canisterId: token.address,
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
    setAmount(parseTokenAmount(new BigNumber(balance).minus(token.transFee.toString()), token.decimals).toString());
  };

  let error: string | undefined;
  if (!amount) error = t("common.enter.input.amount");
  if (token === undefined) error = t("common.error.unknown");
  if (
    amount &&
    token &&
    balance &&
    parseTokenAmount(new BigNumber(balance).minus(token.transFee.toString()), token.decimals).isLessThan(amount)
  )
    error = t("common.error.insufficient.balance");

  if (amount && neuron_minimum_stake_e8s && parseTokenAmount(neuron_minimum_stake_e8s, 8).isGreaterThan(amount))
    error = t("common.at.least", {
      amount: `${parseTokenAmount(neuron_minimum_stake_e8s, 8).toString()} ${token?.symbol}`,
    });

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" size="small">
        {t("common.stake")}
      </Button>

      <Modal open={open} onClose={handleClose} title={t("nns.create.neuron")}>
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
                },
              },
            }}
          />

          <Typography>
            {token && balance && tokenUSDPrice ? (
              <>
                {t("common.balance.colon.amount", {
                  amount: `${new BigNumber(
                    parseTokenAmount(balance, token.decimals).toFixed(token.decimals > 8 ? 8 : token.decimals),
                  ).toFormat()} ${token.symbol} (${formatDollarAmount(
                    parseTokenAmount(balance, token.decimals).multipliedBy(tokenUSDPrice).toString(),
                  )})`,
                })}
              </>
            ) : (
              "--"
            )}
          </Typography>

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
            disabled={loading || error !== undefined}
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
