import { Typography } from "components/Mui";
import { BigNumber, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Tooltip } from "@icpswap/ui";
import { Position, TICK_SPACINGS, tickToPrice, Token } from "@icpswap/swap-sdk";
import { Trans, t } from "@lingui/macro";
import { Flex, TextButton, TokenImage } from "components/index";
import { getPriceTick } from "utils/index";
import { isUseTransfer } from "utils/token/index";
import { StepContents, StepContent } from "types/step";

export interface GetLimitOrderStepsProps {
  position: Position | undefined;
  retry: () => void;
  handleReclaim: () => void;
  limitLick: bigint;
  inputToken: Token;
}

export function getLimitOrderSteps({ position, limitLick, retry, handleReclaim }: GetLimitOrderStepsProps) {
  if (!position) return [];

  const { token0, token1 } = position.pool;

  const amount0 = position.mintAmounts.amount0.toString();
  const amount1 = position.mintAmounts.amount1.toString();

  const priceTick = getPriceTick(Number(limitLick), position.pool);
  const tickLower = priceTick - TICK_SPACINGS[position.pool.fee];
  const tickUpper = priceTick + TICK_SPACINGS[position.pool.fee];

  const inputToken = new BigNumber(amount0).isEqualTo(0) ? token1 : token0;
  const outputToken = new BigNumber(amount0).isEqualTo(0) ? token0 : token1;

  const orderPrice = tickToPrice(inputToken, outputToken, priceTick).toFixed();

  const inputAmount = inputToken.address === token0.address ? amount0 : amount1;
  const outputAmount = parseTokenAmount(inputAmount, inputToken.decimals).multipliedBy(orderPrice).toString();

  const formatInputAmount = toSignificantWithGroupSeparator(
    parseTokenAmount(inputAmount, inputToken.decimals).toString(),
  );
  const formatOutputAmount = toSignificantWithGroupSeparator(outputAmount);

  const InputTokenAmount = (
    <Flex gap="0 4px">
      <TokenImage logo={inputToken.logo} size="16px" />
      {formatInputAmount}
    </Flex>
  );

  const OutputTokenAmount = (
    <Flex gap="0 4px">
      <TokenImage logo={outputToken.logo} size="16px" />
      {formatOutputAmount}
    </Flex>
  );

  const LimitPrice = (
    <Flex gap="0 4px">
      <Typography fontSize="12px">
        {`1 ${inputToken.symbol} = ${toSignificantWithGroupSeparator(orderPrice)} ${outputToken.symbol}`}
      </Typography>
    </Flex>
  );

  const priceLower = tickToPrice(inputToken, outputToken, tickLower).toFixed();
  const priceUpper = tickToPrice(inputToken, outputToken, tickUpper).toFixed();

  const PriceRange = (
    <Flex gap="0 4px">
      <Typography fontSize="12px">
        {`${toSignificantWithGroupSeparator(priceLower)} - ${toSignificantWithGroupSeparator(priceUpper)} ${
          inputToken.symbol
        } per ${outputToken.symbol}`}
      </Typography>
    </Flex>
  );

  const originSteps: StepContent[] = [
    ...(inputToken.equals(token0)
      ? [
          {
            title: isUseTransfer(inputToken) ? `Transfer ${inputToken.symbol}` : `Approve ${inputToken.symbol}`,
            children: [
              { label: t`Amount`, value: InputTokenAmount },
              { label: t`Canister Id`, value: inputToken.address },
            ],
          },
          {
            title: t`Deposit ${inputToken.symbol}`,
            children: [
              {
                label: t`Amount`,
                value: InputTokenAmount,
              },
              { label: t`Canister Id`, value: inputToken.address },
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
      title: (
        <Flex gap="0 4px">
          <Typography color="text.primary" fontWeight={500} fontSize="16px">
            <Trans>Set Limit Order</Trans>
          </Typography>

          <Tooltip tips="" />
        </Flex>
      ),
      children: [
        { label: <Trans>Limit Price</Trans>, value: LimitPrice },
        { label: <Trans>Price Range</Trans>, value: PriceRange },
        { label: <Trans>You Pay</Trans>, value: InputTokenAmount },
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
      title: t`Submit Limit Order`,
      children: [
        { label: <Trans>Limit Price</Trans>, value: LimitPrice },
        { label: <Trans>You Pay</Trans>, value: InputTokenAmount },
        { label: <Trans>You Expect to Receive</Trans>, value: OutputTokenAmount },
      ],
    },
  ];

  return originSteps
    .filter((step) => step !== undefined)
    .map((step, index) => ({ ...step, step: index }) as StepContents);
}
