import { Box, Avatar } from "components/Mui";
import { Position } from "@icpswap/swap-sdk";
import { parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { t, Trans } from "@lingui/macro";
import { isUseTransfer } from "utils/token/index";
import { StepContents } from "types/step";
import { TextButton } from "components/index";

export interface IncreaseLiquidityStepsProps {
  position: Position;
  handleReclaim: () => void;
  retry?: () => Promise<boolean>;
}

export function getIncreaseLiquiditySteps({ position, handleReclaim }: IncreaseLiquidityStepsProps) {
  const { token0, token1 } = position.pool;

  const amount0 = toSignificantWithGroupSeparator(
    parseTokenAmount(position.mintAmounts.amount0.toString(), position.pool.token0.decimals).toString(),
    8,
  );

  const amount1 = toSignificantWithGroupSeparator(
    parseTokenAmount(position.mintAmounts.amount1.toString(), position.pool.token1.decimals).toString(),
    8,
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
      errorMessage: t`Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool.`,
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
      errorMessage: t`Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool.`,
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
      errorMessage: t`Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool.`,
    },
  ] as StepContents[];
}
