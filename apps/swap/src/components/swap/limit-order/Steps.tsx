import { Typography } from "components/Mui";
import { parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Position, tickToPrice, Token } from "@icpswap/swap-sdk";
import { Trans, t } from "@lingui/macro";
import { Flex, TextButton, TokenImage } from "components/index";
import { isUseTransfer } from "utils/token/index";
import { StepContents, StepContent } from "types/step";

export interface GetLimitOrderStepsProps {
  position: Position | undefined;
  retry: () => void;
  handleReclaim: () => void;
  inputToken: Token;
}

export function getLimitOrderSteps({ position, inputToken, retry, handleReclaim }: GetLimitOrderStepsProps) {
  if (!position) return [];

  const { token0, token1 } = position.pool;

  const outputToken = inputToken.equals(token0) ? token1 : token0;
  const isInputTokenSorted = inputToken.sortsBefore(outputToken);

  const amount0 = position.mintAmounts.amount0.toString();
  const amount1 = position.mintAmounts.amount1.toString();

  const tickLower = position.tickLower;
  const tickUpper = position.tickUpper;

  const orderPrice = tickToPrice(inputToken, outputToken, isInputTokenSorted ? tickUpper : tickLower).toFixed(
    outputToken.decimals,
  );

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
    <Flex gap="0 4px" justify="flex-end">
      <Typography fontSize="12px" align="right">
        {`${toSignificantWithGroupSeparator(priceLower)} - ${toSignificantWithGroupSeparator(priceUpper)} ${
          inputToken.symbol
        } per ${outputToken.symbol}`}
      </Typography>
    </Flex>
  );

  const originSteps: StepContent[] = [
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
    {
      title: (
        <Typography color="text.primary" fontWeight={500} fontSize="16px">
          <Trans>Set Limit Order</Trans>
        </Typography>
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
      errorMessage: t`Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool. You can retrieve your limit order tokens on the liquidity page after importing this trading pair.`,
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
