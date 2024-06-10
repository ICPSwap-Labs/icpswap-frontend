import React, { useMemo, useState } from "react";
import { Button, Typography, Grid, Box, CircularProgress } from "@mui/material";
import { t, Trans } from "@lingui/macro";
import { Modal, NumberTextField, StepViewButton } from "components/index";
import { BigNumber, parseTokenAmount, formatTokenAmount, isNullArgs } from "@icpswap/utils";
import MaxButton from "components/MaxButton";
import { type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useUnstakeCall } from "hooks/staking-token/useUnstake";
import { useUserStakingInfo } from "hooks/staking-token/index";
import { useLoadingTip } from "hooks/useTips";
import { useAccountPrincipal } from "store/auth/hooks";
import { useToken } from "hooks/useCurrency";

export interface ClaimModalProps {
  open: boolean;
  onClose?: () => void;
  pool: StakingPoolControllerPoolInfo;
  onStakingSuccess?: () => void;
}

export default function UnstakeModal({ open, onClose, pool, onStakingSuccess }: ClaimModalProps) {
  const principal = useAccountPrincipal();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const [userInfo] = useUserStakingInfo(pool.canisterId.toString(), principal);

  const userStakingAmount = useMemo(() => userInfo?.stakeAmount, [userInfo]);

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string | number | undefined>(undefined);

  const [, stakingToken] = useToken(pool.stakingToken.address);
  const [, rewardToken] = useToken(pool.rewardToken.address);

  const getUnstakeCall = useUnstakeCall();

  const handleSubmit = async () => {
    if (loading || !amount || !stakingToken || !rewardToken || !principal) return;

    setLoading(true);

    if (onClose) onClose();

    const { call, key } = await getUnstakeCall({
      poolId: pool.canisterId.toString(),
      amount: BigInt(formatTokenAmount(amount, stakingToken.decimals).toString()),
      token: stakingToken,
      rewardToken,
    });

    const loadingTipKey = openLoadingTip(`Unstake ${amount} ${stakingToken.symbol}`, {
      extraContent: <StepViewButton step={key} />,
    });

    await call();

    closeLoadingTip(loadingTipKey);

    if (onStakingSuccess) onStakingSuccess();
    setLoading(false);
  };

  const tokenAmount = useMemo(() => {
    if (isNullArgs(userStakingAmount) || isNullArgs(stakingToken)) return undefined;
    return parseTokenAmount(userStakingAmount.toString(), stakingToken.decimals);
  }, [userStakingAmount, stakingToken]);

  const handleMax = () => {
    if (tokenAmount) {
      setAmount(tokenAmount.toNumber());
    }
  };

  let errorMessage = "";
  if (
    amount &&
    formatTokenAmount(amount, stakingToken?.decimals).isGreaterThan(new BigNumber(String(userStakingAmount ?? 0)))
  )
    errorMessage = t`Insufficient balance`;
  if (!amount || new BigNumber(amount).isEqualTo(0)) errorMessage = t`Enter an amount`;

  return (
    <Modal open={open} onClose={onClose} title={t`Unstake`}>
      <Grid>
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
            decimalScale: Number(stakingToken?.decimals ?? 8),
            allowNegative: false,
            thousandSeparator: true,
          }}
        />

        <Grid container alignItems="center" sx={{ margin: "10px 0" }}>
          <Typography>
            <Trans>Staked</Trans>: {tokenAmount ? tokenAmount.toFormat() : "--"} {pool.stakingTokenSymbol}
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
            disabled={loading || !Number(userStakingAmount ?? 0) || !!errorMessage}
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
      </Grid>
    </Modal>
  );
}
