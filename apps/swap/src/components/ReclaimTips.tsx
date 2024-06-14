import { TextButton } from "components/index";
import { Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useCloseStep } from "hooks/useStepCall";

export interface ReclaimTipsProps {
  message: string | undefined;
  onReclaimClick?: () => void;
  tipKey: string | undefined;
  poolId?: string;
  tokenId?: string;
}

export function ReclaimTips({ message, onReclaimClick, tipKey, poolId, tokenId }: ReclaimTipsProps) {
  const history = useHistory();

  const closeStep = useCloseStep();

  const handleClick = () => {
    const to = poolId
      ? `/swap/reclaim?type=pair&poolId=${poolId}`
      : tokenId
      ? `/swap/reclaim?type=token&tokenId=${tokenId}`
      : "/swap/reclaim";

    history.push(to);
    if (onReclaimClick) onReclaimClick();
    closeStep(tipKey);
  };

  const msg = message?.includes("please withdraw your unused token") ? (
    <>
      {message.replace("please withdraw your unused token", "")}.&nbsp; Please click&nbsp;
      <TextButton onClick={handleClick}>Reclaim your tokens</TextButton> if they've transferred to the swap pool.
    </>
  ) : (
    <>
      {message}.&nbsp; Please click <TextButton onClick={handleClick}>Reclaim your tokens</TextButton> if they've
      transferred to the swap pool.
    </>
  );

  return <Typography component="span">{msg}</Typography>;
}
