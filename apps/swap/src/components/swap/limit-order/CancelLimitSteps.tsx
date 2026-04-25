import type { Principal } from "@icpswap/dfinity";
import { type Position, type Token, tickToPrice } from "@icpswap/swap-sdk";
import type { LimitOrder } from "@icpswap/types";
import { formatTokenPrice } from "@icpswap/utils";
import { Flex, TokenImage } from "components/index";
import { Typography } from "components/Mui";
import { getLimitTokenAndAmount } from "hooks/swap/limit-order";
import i18n from "i18n/index";
import type { StepContents } from "types/step";

export interface CancelLimitStepsProps {
  positionId: bigint;
  principal: Principal | undefined;
  position: Position;
  key: string;
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

export function getCancelLimitSteps({ position, limit }: CancelLimitStepsProps) {
  const { inputToken, outputToken, inputAmount } = getLimitTokenAndAmount({
    limit,
    position,
  });

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
      title: i18n.t`Cancel the limit order`,
      children: [
        { label: i18n.t("common.limit.price"), value: LimitPrice },
        {
          label: `${inputToken.symbol}`,
          value: <TokenAmount amount={inputAmount.toExact()} token={inputToken} />,
        },
      ],
    },
  ];

  return contents.filter((e) => !!e).map((element, index) => ({ ...element, step: index })) as StepContents[];
}
