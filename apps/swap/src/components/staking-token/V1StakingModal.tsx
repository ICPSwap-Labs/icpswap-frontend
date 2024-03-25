import { useTips, MessageTypes } from "hooks/useTips";
import { useAccountPrincipal } from "store/auth/hooks";
import { stakingV1TokenDeposit } from "@icpswap/hooks";
import { useApprove } from "hooks/token/useApprove";
import { getLocaleMessage } from "locales/services";
import type { StakingPoolControllerPoolInfo } from "@icpswap/types";
import StakingModal, { StakingProps } from "components/staking-token/StakingModal";

export interface StakingModalProps {
  open: boolean;
  onClose?: () => void;
  onStakingSuccess?: () => void;
  pool: StakingPoolControllerPoolInfo | undefined;
}

export default function V1StakingModal({ open, onClose, onStakingSuccess, pool }: StakingModalProps) {
  const [openTip] = useTips();

  const principal = useAccountPrincipal();
  const approve = useApprove();

  const handleStaking = async ({ identity, amount }: StakingProps) => {
    if (!pool) return;

    const { status, message } = await approve({
      canisterId: pool.stakingToken.address,
      spender: pool.canisterId,
      value: BigInt(amount),
      account: principal,
    });

    if (status === "ok") {
      const { status, message } = await stakingV1TokenDeposit(pool.canisterId, identity, BigInt(amount));
      openTip(getLocaleMessage(message), status);
      if (onStakingSuccess) onStakingSuccess();
      if (onClose) onClose();
    } else {
      openTip(getLocaleMessage(message), MessageTypes.error);
    }
  };

  return pool ? (
    <StakingModal
      open={open}
      onClose={onClose}
      onStakingSuccess={onStakingSuccess}
      pool={pool}
      onStaking={handleStaking}
    />
  ) : null;
}
