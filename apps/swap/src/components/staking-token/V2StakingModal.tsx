import { useAccountPrincipal } from "store/auth/hooks";
import type { StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useStakeCall } from "hooks/staking-token/useStake";
import { useLoadingTip, useTips, MessageTypes } from "hooks/useTips";
import { StepViewButton } from "components/index";
import StakingModal, { StakingProps } from "components/staking-token/StakingModal";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";
import { t } from "@lingui/macro";

export interface StakingModalProps {
  open: boolean;
  onClose?: () => void;
  onStakingSuccess?: () => void;
  pool: StakingPoolControllerPoolInfo;
}

export default function V2StakingModal({ open, onClose, onStakingSuccess, pool }: StakingModalProps) {
  const principal = useAccountPrincipal();
  const getStakeCall = useStakeCall();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [openTip] = useTips();

  const handleStaking = async ({ amount, token, rewardToken }: StakingProps) => {
    if (!token || !principal || !amount) return;

    const { call, key } = getStakeCall({
      token,
      amount,
      poolId: pool.canisterId.toString(),
      standard: pool.stakingToken.standard as TOKEN_STANDARD,
      rewardToken,
    });

    const loadingTipKey = openLoadingTip(`Staking ${token.symbol}`, {
      extraContent: <StepViewButton step={key} />,
    });

    const result = await call();

    if (result) {
      openTip(t`Stake successfully`, MessageTypes.success);
    }

    closeLoadingTip(loadingTipKey);
  };

  return (
    <StakingModal
      open={open}
      onClose={onClose}
      onStakingSuccess={onStakingSuccess}
      onStaking={handleStaking}
      pool={pool}
    />
  );
}
