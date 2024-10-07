import { Box } from "components/Mui";
import { BigNumber, parseTokenAmount } from "@icpswap/utils";
import { Position, Token } from "@icpswap/swap-sdk";
import { Trans, t } from "@lingui/macro";
import { TextButton, TokenImage } from "components/index";
import { toFormat } from "utils/index";
import { isUseTransfer } from "utils/token/index";
import { StepContents, StepContent } from "types/step";
// import { getPlaceOrderPositionId } from "store/swap/limit-order/hooks";

export interface GetLimitOrderStepsProps {
  position: Position | undefined;
  retry: () => void;
  handleReclaim: () => void;
  limitLick: bigint;
  inputToken: Token;
}

export function getLimitOrderSteps({ position, retry, handleReclaim }: GetLimitOrderStepsProps) {
  if (!position) return [];

  const { token0, token1 } = position.pool;

  const symbol0 = token0.symbol;
  const symbol1 = token1.symbol;
  const amount0 = position.mintAmounts.amount0.toString();
  const amount1 = position.mintAmounts.amount1.toString();

  const token = new BigNumber(amount0).isEqualTo(0) ? token1 : token0;

  const formatAmount0 = toFormat(parseTokenAmount(amount0, token0.decimals).toString());
  const formatAmount1 = toFormat(parseTokenAmount(amount1, token1.decimals).toString());

  // const positionId = getPlaceOrderPositionId();

  const amount0Value = (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}>
      <TokenImage logo={token0.logo} size="16px" />
      {formatAmount0}
    </Box>
  );

  const amount1Value = (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}>
      <TokenImage logo={token1.logo} size="16px" />
      {formatAmount1}
    </Box>
  );

  const originSteps: StepContent[] = [
    ...(token.equals(token0)
      ? [
          {
            title: isUseTransfer(token0) ? `Transfer ${symbol0}` : `Approve ${symbol0}`,
            children: [
              { label: t`Amount`, value: amount0Value },
              { label: t`Canister Id`, value: token0.address },
            ],
          },
          {
            title: t`Deposit ${symbol0}`,
            children: [
              {
                label: t`Amount`,
                value: amount0Value,
              },
              { label: t`Canister Id`, value: token0.address },
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
        ]
      : []),
    ...(token.equals(token1)
      ? [
          {
            title: isUseTransfer(token1) ? `Transfer ${symbol1}` : `Approve ${symbol1}`,
            children: [
              { label: t`Amount`, value: amount1Value },
              { label: t`Canister Id`, value: token1.address },
            ],
          },
          {
            title: `Deposit ${symbol1}`,
            children: [
              {
                label: t`Amount`,
                value: amount1Value,
              },
              { label: t`Canister Id`, value: token1.address },
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
        ]
      : []),
    {
      title: `Add liquidity ${token0.symbol} and ${token1.symbol}`,
      children: [
        { label: symbol0, value: amount0Value },
        { label: symbol1, value: amount1Value },
      ],
      errorActions: [
        <TextButton onClick={handleReclaim}>
          <Trans>Reclaim</Trans>
        </TextButton>,
        <TextButton onClick={retry}>
          <Trans>Retry</Trans>
        </TextButton>,
      ],
      errorMessage: t`Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool.`,
    },
    {
      title: t`Add Limit Order`,
      // children: [
      //   { label: t`Price`, value: amount0Value },
      //   { label: t`Position ID`, value: positionId?.toString() },
      // ],
    },
  ];

  return originSteps
    .filter((step) => step !== undefined)
    .map((step, index) => ({ ...step, step: index }) as StepContents);
}
