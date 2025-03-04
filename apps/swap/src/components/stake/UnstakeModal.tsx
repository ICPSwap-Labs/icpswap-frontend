import React, { useEffect, useMemo, useState } from "react";
import { Button, Typography, Box, CircularProgress } from "components/Mui";
import { Flex, Modal, NumberTextField, StepViewButton, MaxButton } from "components/index";
import {
  BigNumber,
  parseTokenAmount,
  formatTokenAmount,
  isNullArgs,
  toSignificantWithGroupSeparator,
  formatDollarAmount,
} from "@icpswap/utils";
import { useUnstakeCall } from "hooks/staking-token/useUnstake";
import { useLoadingTip, useTips, MessageTypes } from "hooks/useTips";
import { useAccountPrincipal } from "store/auth/hooks";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

export interface ClaimModalProps {
  open: boolean;
  onClose?: () => void;
  poolId: string | undefined;
  onUnStakeSuccess?: () => void;
  stakeAmount: bigint | undefined;
  rewardAmount: bigint | undefined;
  stakeToken: Token | undefined;
  rewardToken: Token | undefined;
  rewardTokenPrice: string | number | undefined;
}

export function UnstakeModal({
  open,
  onClose,
  poolId,
  stakeAmount,
  rewardAmount,
  stakeToken,
  rewardToken,
  onUnStakeSuccess,
  rewardTokenPrice,
}: ClaimModalProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [openTip] = useTips();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string | number | undefined>(undefined);

  const getUnstakeCall = useUnstakeCall();

  const handleSubmit = async () => {
    if (loading || !amount || !poolId || !stakeToken || !rewardToken || !principal) return;

    setLoading(true);

    if (onClose) onClose();

    const { call, key } = await getUnstakeCall({
      poolId,
      amount: BigInt(formatTokenAmount(amount, stakeToken.decimals).toString()),
      token: stakeToken,
      rewardToken,
      refresh: () => {
        if (onUnStakeSuccess) onUnStakeSuccess();
      },
    });

    const loadingTipKey = openLoadingTip(`Unstake ${amount} ${stakeToken.symbol}`, {
      extraContent: <StepViewButton step={key} />,
    });

    const result = await call();

    if (result) {
      openTip(t`Unstake successfully`, MessageTypes.success);
    }

    closeLoadingTip(loadingTipKey);
    setLoading(false);
  };

  const tokenAmount = useMemo(() => {
    if (isNullArgs(stakeAmount) || isNullArgs(stakeToken)) return undefined;

    return parseTokenAmount(stakeAmount.toString(), stakeToken.decimals);
  }, [stakeAmount, stakeToken]);

  const handleMax = () => {
    if (tokenAmount) {
      setAmount(tokenAmount.toNumber());
    }
  };

  // Reset amount
  useEffect(() => {
    setAmount("");
  }, [open]);

  const errorMessage = useMemo(() => {
    if (!stakeToken || !stakeAmount) return t`Confirm`;
    if (!amount || new BigNumber(amount).isEqualTo(0)) return t("common.enter.input.amount");
    if (formatTokenAmount(amount, stakeToken.decimals).isGreaterThan(stakeAmount.toString()))
      return t("common.error.insufficient.balance");

    return undefined;
  }, [amount, stakeToken, stakeAmount]);

  return (
    <Modal open={open} onClose={onClose} title={t`Unstake`} background="level1">
      <Flex gap="0 5px">
        <Typography>{t("common.reward.token")}</Typography>

        {/* <Tooltip tips={t`You will receive the reward tokens you have earned after harvesting the staked tokens.`} /> */}
      </Flex>

      {rewardAmount && rewardToken ? (
        <>
          <Typography sx={{ margin: "12px 0 0 0", fontSize: "20px", fontWeight: 600, color: "text.primary" }}>
            {`${toSignificantWithGroupSeparator(
              parseTokenAmount(rewardAmount.toString(), rewardToken.decimals).toString(),
            )} 
          ${rewardToken.symbol}`}
          </Typography>

          {rewardTokenPrice ? (
            <Typography sx={{ margin: "8px 0 0 0" }}>
              {formatDollarAmount(
                parseTokenAmount(rewardAmount.toString(), rewardToken.decimals)
                  .multipliedBy(rewardTokenPrice)
                  .toString(),
              )}
            </Typography>
          ) : null}
        </>
      ) : null}

      <Box mt="25px">
        <NumberTextField
          id="reward"
          name="reward"
          type="text"
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "16px",
            },
          }}
          value={amount}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAmount(event.target.value)}
          fullWidth
          autoComplete="reward"
          numericProps={{
            decimalScale: Number(stakeToken?.decimals ?? 8),
            allowNegative: false,
            thousandSeparator: true,
          }}
        />
      </Box>

      <Flex sx={{ margin: "10px 0 0 0" }} gap="0 5px">
        <Typography>
          {t("common.stake.amount", {
            amount: tokenAmount && stakeToken ? `${tokenAmount.toFormat()} ${stakeToken.symbol}` : "--",
          })}
        </Typography>

        <MaxButton onClick={handleMax} background="rgba(86, 105, 220, 0.50)" />
      </Flex>

      <Box mt={2}>
        <Button
          disabled={loading || !!errorMessage}
          variant="contained"
          fullWidth
          type="button"
          onClick={handleSubmit}
          color="primary"
          size="large"
          startIcon={loading ? <CircularProgress size={22} color="inherit" /> : null}
        >
          {errorMessage || t`Confirm`}
        </Button>
      </Box>
    </Modal>
  );
}
