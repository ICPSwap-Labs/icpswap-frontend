import { Box, Avatar } from "@mui/material";
import { Position } from "@icpswap/swap-sdk";
import { parseTokenAmount } from "@icpswap/utils";
import { t, Trans } from "@lingui/macro";
import { isUseTransfer, actualAmountToPool } from "utils/token/index";
import { StepDetails } from "components/Steps/types";
import { TextButton } from "components/index";
import { toSignificant } from "@icpswap/utils";

export interface IncreaseLiquidityStepsProps {
  position: Position;
  handleReclaim: () => void;
  retry?: () => Promise<boolean>;
}

export function getIncreaseLiquiditySteps({ position, handleReclaim }: IncreaseLiquidityStepsProps) {
  const token0 = position.pool.token0;
  const token1 = position.pool.token1;

  const amount0 = toSignificant(
    parseTokenAmount(
      actualAmountToPool(token0, position.mintAmounts.amount0.toString()),
      position.pool.token0.decimals,
    ).toString(),
    8,
    { groupSeparator: "," },
  );

  const amount1 = toSignificant(
    parseTokenAmount(
      actualAmountToPool(token1, position.mintAmounts.amount1.toString()),
      position.pool.token1.decimals,
    ).toString(),
    8,
    { groupSeparator: "," },
  );

  const symbol0 = token0.symbol;
  const symbol1 = token1.symbol;

  const isToken0UseTransfer = isUseTransfer(token0);
  const isToken1UseTransfer = isUseTransfer(token1);

  const amount0Value = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar sx={{ width: "16px", height: "16px", margin: "0 4px 0 0" }} src={position.pool.token0.logo}>
        &nbsp;
      </Avatar>
      {amount0}
    </Box>
  );

  const amount1Value = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar sx={{ width: "16px", height: "16px", margin: "0 4px 0 0" }} src={position.pool.token1.logo}>
        &nbsp;
      </Avatar>
      {amount1}
    </Box>
  );

  return [
    {
      title: isToken0UseTransfer ? `Transfer ${symbol0}` : `Approve ${symbol0}`,
      step: 0,
      children: [
        { label: t`Amount`, value: amount0Value },
        { label: t`Canister Id`, value: position.pool.token0.address },
      ],
    },
    {
      title: t`Deposit ${symbol0}`,
      step: 1,
      children: [
        {
          label: t`Amount`,
          value: amount0Value,
        },
        { label: t`Canister Id`, value: position.pool.token0.address },
      ],
      errorActions: [
        <>
          <TextButton onClick={handleReclaim}>
            <Trans>Reclaim</Trans>
          </TextButton>
        </>,
      ],
      errorMessage: t`Please click Reclaim your tokens if they've transferred to the swap pool.`,
    },
    {
      title: isToken1UseTransfer ? t`Transfer ${symbol1}` : t`Approve ${symbol1}`,
      step: 2,
      children: [
        { label: t`Amount`, value: amount1Value },
        { label: t`Canister Id`, value: position.pool.token1.address },
      ],
    },
    {
      title: t`Deposit ${symbol1}`,
      step: 3,
      children: [
        {
          label: t`Amount`,
          value: amount1Value,
        },
        { label: t`Canister Id`, value: position.pool.token1.address },
      ],
      errorActions: [
        <>
          <TextButton onClick={handleReclaim}>
            <Trans>Reclaim</Trans>
          </TextButton>
        </>,
      ],
      errorMessage: t`Please click Reclaim your tokens if they've transferred to the swap pool.`,
    },
    {
      title: t`Increase liquidity ${position.pool.token0.symbol} and ${position.pool.token1.symbol}`,
      step: 4,
      children: [
        { label: symbol0, value: amount0Value },
        { label: symbol1, value: amount1Value },
      ],
      errorActions: [
        <>
          <TextButton onClick={handleReclaim}>
            <Trans>Reclaim</Trans>
          </TextButton>
        </>,
      ],
      errorMessage: t`Please click Reclaim your tokens if they've transferred to the swap pool.`,
    },
  ] as StepDetails[];
}
