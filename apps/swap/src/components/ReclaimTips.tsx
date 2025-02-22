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
      ? `/swap/withdraw?type=pair&poolId=${poolId}`
      : tokenId
      ? `/swap/withdraw?type=token&tokenId=${tokenId}`
      : "/swap/withdraw";

    history.push(to);
    if (onReclaimClick) onReclaimClick();
    closeStep(tipKey);
  };

  const msg = message?.includes("please withdraw your unused token") ? (
    <>
      {message.replace("please withdraw your unused token", "")}.&nbsp; Please{" "}
      <TextButton onClick={handleClick}>check your balance in the swap pool</TextButton> to see if tokens have been
      transferred to the swap pool.
    </>
  ) : (
    <>
      {message}.&nbsp; Please <TextButton onClick={handleClick}>check your balance in the swap pool</TextButton> to see
      if tokens have been transferred to the swap pool.
    </>
  );

  return <Typography component="span">{msg}</Typography>;
}
