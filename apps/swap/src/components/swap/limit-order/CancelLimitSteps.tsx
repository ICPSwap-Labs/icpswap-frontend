import { parseTokenAmount, BigNumber, shorten, formatTokenPrice, isNullArgs, formatAmount } from "@icpswap/utils";
import { Position, tickToPrice, Token } from "@icpswap/swap-sdk";
import { Principal } from "@dfinity/principal";
import { LimitOrder } from "@icpswap/types";
import { t, Trans } from "@lingui/macro";
import { Flex, TextButton, TokenImage } from "components/index";
import { StepContents } from "types/step";
import { Typography } from "components/Mui";
import { getLimitTokenAndAmount } from "hooks/swap/limit-order";
import { getDecreaseLiquidityAmount } from "store/swap/hooks";

export interface CancelLimitStepsProps {
  positionId: bigint;
  principal: Principal | undefined;
  position: Position;
  key: string;
  handleReclaim: () => void;
  limit: LimitOrder;
}

interface TokenAmountProps {
  amount: string | undefined;
  token: Token;
}

function TokenAmount({ token, amount }: TokenAmountProps) {
  return (
    <Flex gap="0 4px">
      <TokenImage size="16px" logo={token.logo} tokenId={token.address} />
      {amount ?? "--"}
    </Flex>
  );
}

export function getCancelLimitSteps({ principal, handleReclaim, position, limit, key }: CancelLimitStepsProps) {
  const {
    pool: { token0 },
    amount0: positionAmount0,
    amount1: positionAmount1,
  } = position;

  const { amount0: liquidityAmount0, amount1: liquidityAmount1 } = getDecreaseLiquidityAmount(key) ?? {};

  const { inputToken, outputToken, inputAmount } = getLimitTokenAndAmount({
    limit,
    position,
  });

  const noInverted = inputToken.equals(token0);

  const inputPositionAmount = noInverted ? positionAmount0 : positionAmount1;
  const outputPositionAmount = noInverted ? positionAmount1 : positionAmount0;

  const inputRemainingAmount = noInverted ? liquidityAmount0 : liquidityAmount1;
  const outputDealAmount = noInverted ? liquidityAmount1 : liquidityAmount0;

  const inputWithdrawAmount = isNullArgs(inputRemainingAmount)
    ? undefined
    : formatAmount(parseTokenAmount(inputRemainingAmount, inputToken.decimals).toString());
  const outputWithdrawAmount = isNullArgs(outputDealAmount)
    ? undefined
    : formatAmount(parseTokenAmount(outputDealAmount, outputToken.decimals).toString());

  const inputWithdrawAmountLessThanFee = isNullArgs(inputRemainingAmount)
    ? false
    : new BigNumber(inputRemainingAmount.toString()).minus(inputToken.transFee).isLessThan(0);
  const outputWithdrawAmountLessThanFee = isNullArgs(outputDealAmount)
    ? false
    : new BigNumber(outputDealAmount.toString()).minus(outputToken.transFee).isLessThan(0);

  const priceTick = position.tickUpper < position.pool.tickCurrent ? position.tickLower : position.tickUpper;
  const orderPrice = tickToPrice(inputToken, outputToken, priceTick).toFixed(outputToken.decimals);

  const LimitPrice = (
    <Flex gap="0 4px">
      <Typography fontSize="12px">
        {`1 ${inputToken.symbol} = ${formatTokenPrice(orderPrice)} ${outputToken.symbol}`}
      </Typography>
    </Flex>
  );

  const contents = [
    {
      title: t`Cancel the limit order`,
      children: [
        { label: t`Limit Price`, value: LimitPrice },
        {
          label: `${inputToken.symbol}`,
          value: <TokenAmount amount={inputAmount.toExact()} token={inputToken} />,
        },
      ],
    },
    {
      title: t`Remove the tokens from the limit order`,
      children: [
        { label: t`Limit Price`, value: LimitPrice },
        {
          label: `${inputToken.symbol}`,
          value: <TokenAmount amount={inputAmount.toExact()} token={inputToken} />,
        },
      ],
    },
    // Withdraw input token
    new BigNumber(inputPositionAmount.toExact()).isEqualTo(0)
      ? null
      : {
          title: inputWithdrawAmountLessThanFee
            ? t`Unable to withdraw ${inputToken.symbol}`
            : t`Withdraw ${inputToken.symbol}`,
          children: [
            {
              label: t`Amount`,
              value: <TokenAmount amount={inputWithdrawAmount} token={inputToken} />,
            },
            { label: t`Principal ID`, value: shorten(principal?.toString() ?? "", 6) },
          ],
          skipError: inputWithdrawAmountLessThanFee
            ? t`The amount of withdrawal is less than the transfer fee`
            : undefined,
          errorActions: [
            <TextButton onClick={handleReclaim}>
              <Trans>Reclaim</Trans>
            </TextButton>,
          ],
          errorMessage: t`Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool.`,
        },
    // Withdraw output token
    new BigNumber(outputPositionAmount.toExact()).isEqualTo(0)
      ? null
      : {
          title: outputWithdrawAmountLessThanFee
            ? t`Unable to withdraw ${outputToken.symbol}`
            : t`Withdraw ${outputToken.symbol}`,
          children: [
            {
              label: t`Amount`,
              value: <TokenAmount amount={outputWithdrawAmount} token={outputToken} />,
            },
            { label: t`Principal ID`, value: shorten(principal?.toString() ?? "", 6) },
          ],
          skipError: outputWithdrawAmountLessThanFee
            ? t`The amount of withdrawal is less than the transfer fee`
            : undefined,
          errorActions: [
            <TextButton onClick={handleReclaim}>
              <Trans>Reclaim</Trans>
            </TextButton>,
          ],
          errorMessage: t`Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool.`,
        },
  ];

  return contents.filter((e) => !!e).map((element, index) => ({ ...element, step: index })) as StepContents[];
}
