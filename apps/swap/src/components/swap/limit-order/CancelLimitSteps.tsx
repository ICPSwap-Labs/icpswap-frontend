import { parseTokenAmount, BigNumber, shorten, toSignificantWithGroupSeparator, nonNullArgs } from "@icpswap/utils";
import { Position, TICK_SPACINGS, tickToPrice, Token } from "@icpswap/swap-sdk";
import { t, Trans } from "@lingui/macro";
import { Flex, TextButton, TokenImage } from "components/index";
import { Principal } from "@dfinity/principal";
import { StepContents } from "types/step";
import { Typography } from "components/Mui";

export interface CancelLimitStepsProps {
  positionId: bigint;
  principal: Principal | undefined;
  position: Position;
  key: string;
  keepTokenInPools?: boolean;
  handleReclaim: () => void;
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

export function getCancelLimitSteps({ principal, handleReclaim, keepTokenInPools, position }: CancelLimitStepsProps) {
  const { token0, token1 } = position.pool;

  const token = position.amount0.equalTo(0) ? token1 : token0;
  const amount = position.amount0.equalTo(0) ? position.amount1.toExact() : position.amount0.toExact();
  const outputToken = token.equals(token1) ? token0 : token1;

  const priceTick = position.tickUpper - TICK_SPACINGS[position.pool.fee];
  const orderPrice = tickToPrice(token, outputToken, priceTick).toFixed();

  const withdrawAmount = nonNullArgs(amount) ? toSignificantWithGroupSeparator(amount) : undefined;

  const withdrawAmountLessThanZero =
    amount === undefined
      ? false
      : new BigNumber(amount).isEqualTo(0)
      ? false
      : !token
      ? false
      : new BigNumber(amount).minus(parseTokenAmount(token.transFee, token.decimals)).isLessThan(0);

  const LimitPrice = (
    <Flex gap="0 4px">
      <Typography fontSize="12px">
        {`1 ${token.symbol} = ${toSignificantWithGroupSeparator(orderPrice)} ${outputToken.symbol}`}
      </Typography>
    </Flex>
  );

  const contents = [
    {
      title: t`Cancel the limit order`,
      step: 0,
      children: [
        { label: t`Limit Price`, value: LimitPrice },
        {
          label: `${token.symbol}`,
          value: <TokenAmount amount={withdrawAmount} token={token} />,
        },
      ],
    },
    {
      title: t`Remove the tokens from the limit order`,
      step: 1,
      children: [
        { label: t`Limit Price`, value: LimitPrice },
        {
          label: `${token.symbol}`,
          value: <TokenAmount amount={withdrawAmount} token={token} />,
        },
      ],
    },
    !keepTokenInPools
      ? {
          title: withdrawAmountLessThanZero ? t`Unable to withdraw ${token.symbol}` : t`Withdraw ${token.symbol}`,
          step: 2,
          children: [
            {
              label: t`Amount`,
              value: <TokenAmount amount={withdrawAmount} token={token} />,
            },
            { label: t`Principal ID`, value: shorten(principal?.toString() ?? "", 6) },
          ],
          skipError: withdrawAmountLessThanZero ? t`The amount of withdrawal is less than the transfer fee` : undefined,
          errorActions: [
            <TextButton onClick={handleReclaim}>
              <Trans>Reclaim</Trans>
            </TextButton>,
          ],
          errorMessage: t`Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool.`,
        }
      : null,
  ];

  return contents.filter((e) => !!e) as StepContents[];
}
