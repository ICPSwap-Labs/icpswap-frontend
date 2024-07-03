import React, { useMemo, useState } from "react";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import { t, Trans } from "@lingui/macro";
import { Flex, Modal, NumberTextField, StepViewButton, Tooltip, MaxButton } from "components/index";
import {
  BigNumber,
  parseTokenAmount,
  formatTokenAmount,
  isNullArgs,
  toSignificantWithGroupSeparator,
  formatDollarAmount,
} from "@icpswap/utils";
import { useUnstakeCall } from "hooks/staking-token/useUnstake";
import { useLoadingTip } from "hooks/useTips";
import { useAccountPrincipal } from "store/auth/hooks";
import { Token } from "@icpswap/swap-sdk";

export interface ClaimModalProps {
  open: boolean;
  onClose?: () => void;
  poolId: string | undefined;
  onUnStakeSuccess?: () => void;
  stakeAmount: bigint | undefined;
  stakeToken: Token | undefined;
  rewardToken: Token | undefined;
  stakeTokenPrice: string | number | undefined;
}

export function UnstakeModal({
  open,
  onClose,
  poolId,
  stakeAmount,
  stakeToken,
  rewardToken,
  onUnStakeSuccess,
  stakeTokenPrice,
}: ClaimModalProps) {
  const principal = useAccountPrincipal();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

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
    });

    const loadingTipKey = openLoadingTip(`Unstake ${amount} ${stakeToken.symbol}`, {
      extraContent: <StepViewButton step={key} />,
    });

    await call();

    closeLoadingTip(loadingTipKey);
    if (onUnStakeSuccess) onUnStakeSuccess();
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

  const errorMessage = useMemo(() => {
    if (!stakeToken || !stakeAmount) return t`Confirm`;
    if (!amount || new BigNumber(amount).isEqualTo(0)) return t`Enter an amount`;
    if (formatTokenAmount(amount, stakeToken.decimals).isGreaterThan(stakeAmount.toString()))
      return t`Insufficient balance`;

    return undefined;
  }, [amount, stakeToken, stakeAmount]);

  return (
    <Modal open={open} onClose={onClose} title={t`Unstake`} background="level1">
      <Flex gap="0 5px">
        <Typography>
          <Trans>Reward Token</Trans>
        </Typography>

        <Tooltip tips={t`You will receive the reward tokens you have earned after harvest the staked tokens.`} />
      </Flex>

      {stakeAmount && stakeToken ? (
        <>
          <Typography sx={{ margin: "12px 0 0 0", fontSize: "20px", fontWeight: 600, color: "text.primary" }}>
            {`${toSignificantWithGroupSeparator(
              parseTokenAmount(stakeAmount.toString(), stakeToken.decimals).toString(),
            )} 
          ${stakeToken.symbol}`}
          </Typography>

          {stakeTokenPrice ? (
            <Typography sx={{ margin: "8px 0 0 0" }}>
              {formatDollarAmount(
                parseTokenAmount(stakeAmount.toString(), stakeToken.decimals).multipliedBy(stakeTokenPrice).toString(),
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
          style={{ marginBottom: 6 }}
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
          <Trans>Staked</Trans>: {tokenAmount && stakeToken ? `${tokenAmount.toFormat()} ${stakeToken.symbol}` : "--"}{" "}
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
