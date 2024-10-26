import { useState, useMemo } from "react";
import { Button, Box, CircularProgress, Typography } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { t, Trans } from "@lingui/macro";
import { useTips } from "hooks/useTips";
import { getLocaleMessage } from "locales/services";
import { Modal } from "components/index";
import { type FarmInfo, ResultStatus, InitFarmArgs } from "@icpswap/types";
import { farmUnstake, farmWithdraw } from "@icpswap/hooks";
import { Position, Token } from "@icpswap/swap-sdk";
import { useUSDPrice } from "hooks/useUSDPrice";
import { BigNumber, formatDollarAmount, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { useIntervalUserRewardInfo } from "hooks/staking-farm";

import { PositionCard } from "./PositionCard1";

export interface UnStakingModalProps {
  open: boolean;
  onClose: () => void;
  resetData?: () => void;
  farmInfo: FarmInfo | undefined;
  farmId: string;
  position: Position | undefined;
  positionId: bigint;
  farmInitArgs: InitFarmArgs | undefined;
  rewardToken: Token | undefined;
}

export function Unstake({
  open,
  onClose,
  resetData,
  farmId,
  farmInitArgs,
  position,
  positionId,
  rewardToken,
}: UnStakingModalProps) {
  const [openTip] = useTips();

  const [confirmLoading, setConfirmLoading] = useState(false);

  const __userRewardAmount = useIntervalUserRewardInfo(farmId, [positionId]);

  const rewardTokenPrice = useUSDPrice(rewardToken);

  const userRewardAmount = useMemo(() => {
    if (!farmInitArgs || !__userRewardAmount || !rewardToken) return undefined;
    const userRewardRatio = new BigNumber(1).minus(new BigNumber(farmInitArgs.fee.toString()).dividedBy(1000));
    return parseTokenAmount(__userRewardAmount, rewardToken.decimals).multipliedBy(userRewardRatio).toString();
  }, [__userRewardAmount, farmInitArgs, rewardToken]);

  const rewardAmountValue = useMemo(() => {
    if (!userRewardAmount || !rewardTokenPrice) return undefined;
    return new BigNumber(userRewardAmount).multipliedBy(rewardTokenPrice).toString();
  }, [userRewardAmount, rewardTokenPrice]);

  const handelUnstake = async () => {
    setConfirmLoading(true);
    const { status, message } = await farmUnstake(farmId, positionId);

    if (status === ResultStatus.OK) {
      await farmWithdraw(farmId);
      openTip(getLocaleMessage(message) ?? t`Unstake successfully`, ResultStatus.OK);

      if (resetData) resetData();
    } else {
      openTip(getLocaleMessage(message) ?? t`Failed to unstake`, ResultStatus.ERROR);
    }

    setConfirmLoading(false);

    if (onClose) onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={t`Unstake`} background="level1">
      <Flex>
        <Typography>
          <Trans>Reward Token</Trans>
        </Typography>
      </Flex>

      <Typography sx={{ margin: "12px 0 0 0", color: "text.primary", fontSize: "20px", fontWeight: 600 }}>
        {userRewardAmount && rewardToken
          ? `${toSignificantWithGroupSeparator(userRewardAmount)} ${rewardToken.symbol}`
          : "--"}
      </Typography>

      <Typography sx={{ margin: "8px 0 0 0" }}>
        {rewardAmountValue ? `~${formatDollarAmount(rewardAmountValue)}` : "--"}
      </Typography>

      <Box mt="24px">
        <PositionCard position={position} positionId={positionId} />
      </Box>

      <Box mt="24px">
        <Button
          disabled={confirmLoading}
          variant="contained"
          fullWidth
          type="button"
          onClick={handelUnstake}
          color="primary"
          size="large"
          startIcon={confirmLoading ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {t`Confirm`}
        </Button>
      </Box>
    </Modal>
  );
}
