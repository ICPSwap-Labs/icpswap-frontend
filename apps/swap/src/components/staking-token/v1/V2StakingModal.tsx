import { useAccountPrincipal } from "store/auth/hooks";
import type { StakingPoolControllerPoolInfo } from "types/staking-token-v1";
import { useStakingToken } from "hooks/staking-token/v1/calls";
import { useLoadingTip } from "hooks/useTips";
import { StepViewButton } from "components/index";
import StakingModal, { StakingProps } from "components/staking-token/v1/StakingModal";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";

export interface StakingModalProps {
  open: boolean;
  onClose?: () => void;
  onStakingSuccess?: () => void;
  pool: StakingPoolControllerPoolInfo | undefined;
}

export default function V2StakingModal({ open, onClose, onStakingSuccess, pool }: StakingModalProps) {
  const principal = useAccountPrincipal();
  const staking = useStakingToken();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const handleStaking = async ({ amount, token }: StakingProps) => {
    if (!token || !principal || !amount || !pool) return;

    const { call, key } = staking({
      token,
      amount,
      poolId: pool.canisterId,
      standard: token.standard as TOKEN_STANDARD,
    });

    const loadingTipKey = openLoadingTip(`Staking ${token.symbol}`, {
      extraContent: <StepViewButton step={key} />,
    });

    const result = await call();

    if (!result) {
      closeLoadingTip(loadingTipKey);
      return;
    }

    closeLoadingTip(loadingTipKey);
  };

  return pool ? (
    <StakingModal
      open={open}
      onClose={onClose}
      onStakingSuccess={onStakingSuccess}
      onStaking={handleStaking}
      pool={pool}
    />
  ) : null;
}
