import React, { useEffect, useMemo, useState } from "react";
import { Button, Typography, Grid, Box, CircularProgress } from "components/Mui";
import { useAccountPrincipal } from "store/auth/hooks";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { Token } from "@icpswap/swap-sdk";
import { parseTokenAmount, numberToString, formatTokenAmount, isNullArgs } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import MaxButton from "components/MaxButton";
import type { StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useToken } from "hooks/useCurrency";
import { Modal, NumberTextField } from "components/index";
import { isUseTransfer } from "utils/token";
import { useTranslation } from "react-i18next";

export interface StakingProps {
  token: Token;
  amount: string;
  id: string;
  rewardToken: Token;
}

export interface StakingModalProps {
  open: boolean;
  onClose?: () => void;
  onStakingSuccess?: () => void;
  pool: StakingPoolControllerPoolInfo;
  onStaking: (args: StakingProps) => Promise<void>;
}

export function StakeModal({ open, onClose, onStakingSuccess, pool, onStaking }: StakingModalProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string | number | undefined>(undefined);

  const { result: _balance } = useTokenBalance(pool.stakingToken.address, principal);
  const [, token] = useToken(pool.stakingToken.address);
  const [, rewardToken] = useToken(pool.rewardToken.address);

  const balance = useMemo(() => {
    if (isNullArgs(_balance) || isNullArgs(token)) return undefined;
    return parseTokenAmount(_balance, token.decimals);
  }, [_balance, token]);

  const handleSubmit = async () => {
    setLoading(true);

    if (loading || !token || !principal || !amount || !rewardToken) return;

    await onStaking({
      token,
      amount: numberToString(formatTokenAmount(amount, token.decimals)),
      id: pool.canisterId.toString(),
      rewardToken,
    });

    setLoading(false);

    if (onStakingSuccess) onStakingSuccess();
    if (onClose) onClose();
  };

  useEffect(() => {
    setAmount("");
  }, [open]);

  let errorMessage = "";
  if (amount && balance && balance.isLessThan(new BigNumber(amount)))
    errorMessage = t("common.error.insufficient.balance");
  if (amount && token && !parseTokenAmount(token.transFee, token.decimals).isLessThan(amount))
    errorMessage = t("common.error.amount.greater.than.fee");
  if (!amount || new BigNumber(amount).isEqualTo(0)) errorMessage = t("common.enter.input.amount");
  if (
    amount &&
    balance &&
    token &&
    isUseTransfer(token) &&
    !formatTokenAmount(amount, token.decimals).isGreaterThan(token.transFee)
  )
    errorMessage = t("common.error.amount.greater.than.fee");

  const handleMax = () => {
    if (balance && token) {
      if (!balance.isLessThan(parseTokenAmount(token.transFee, token.decimals).multipliedBy(3))) {
        setAmount(balance.minus(parseTokenAmount(token.transFee, token.decimals).multipliedBy(3)).toNumber());
      } else {
        setAmount(balance.toNumber());
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={t`Staking`}>
      <Grid>
        <NumberTextField
          type="text"
          value={amount}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAmount(event.target.value)}
          defaultValue={amount}
          fullWidth
          autoComplete="reward"
          numericProps={{
            decimalScale: Number(token?.decimals ?? 8),
            allowNegative: false,
            thousandSeparator: true,
          }}
        />

        <Grid container alignItems="center" sx={{ margin: "10px 0" }}>
          <Typography>
            {t("common.balance.colon.amount", {
              amount: `${balance ? balance.toFormat() : "--"} ${pool.stakingTokenSymbol}`,
            })}
          </Typography>

          <MaxButton
            sx={{
              marginLeft: "6px",
            }}
            onClick={handleMax}
          />
        </Grid>

        <Box mt={2}>
          <Button
            disabled={loading || !new BigNumber(String(balance)).toNumber() || !!errorMessage}
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            size="large"
            startIcon={loading ? <CircularProgress size={22} color="inherit" /> : null}
          >
            {errorMessage || t`Confirm`}
          </Button>
        </Box>
      </Grid>
    </Modal>
  );
}
