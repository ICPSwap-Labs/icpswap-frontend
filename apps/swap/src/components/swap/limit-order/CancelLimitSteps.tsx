import { parseTokenAmount, BigNumber, shorten, formatTokenPrice, isNullArgs, formatAmount } from "@icpswap/utils";
import { Position, tickToPrice, Token } from "@icpswap/swap-sdk";
import { Principal } from "@dfinity/principal";
import { LimitOrder } from "@icpswap/types";
import { Flex, TextButton, TokenImage } from "components/index";
import { StepContents } from "types/step";
import { Typography } from "components/Mui";
import { getLimitTokenAndAmount } from "hooks/swap/limit-order";
import { getDecreaseLiquidityAmount } from "store/swap/hooks";
import i18n from "i18n/index";

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
      title: i18n.t`Cancel the limit order`,
      children: [
        { label: i18n.t("common.limit.price"), value: LimitPrice },
        {
          label: `${inputToken.symbol}`,
          value: <TokenAmount amount={inputAmount.toExact()} token={inputToken} />,
        },
      ],
    },
    {
      title: i18n.t`Remove the tokens from the limit order`,
      children: [
        { label: i18n.t("common.limit.price"), value: LimitPrice },
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
            ? i18n.t("common.unable.withdraw", { symbol: inputToken.symbol })
            : i18n.t("common.withdraw.amount", { amount: inputToken.symbol }),
          children: [
            {
              label: i18n.t("common.amount"),
              value: <TokenAmount amount={inputWithdrawAmount} token={inputToken} />,
            },
            { label: i18n.t("common.principal.id"), value: shorten(principal?.toString() ?? "", 6) },
          ],
          skipError: inputWithdrawAmountLessThanFee ? i18n.t("common.amount.withdrawal.less.than.fee") : undefined,
          errorActions: [<TextButton onClick={handleReclaim}>{i18n.t("common.reclaim")}</TextButton>],
          errorMessage: i18n.t("common.check.balance.tips"),
        },
    // Withdraw output token
    new BigNumber(outputPositionAmount.toExact()).isEqualTo(0)
      ? null
      : {
          title: outputWithdrawAmountLessThanFee
            ? i18n.t("common.unable.withdraw", { amount: outputToken.symbol })
            : i18n.t("common.withdraw.amount", { amount: outputToken.symbol }),
          children: [
            {
              label: i18n.t("common.amount"),
              value: <TokenAmount amount={outputWithdrawAmount} token={outputToken} />,
            },
            { label: i18n.t("common.principal.id"), value: shorten(principal?.toString() ?? "", 6) },
          ],
          skipError: outputWithdrawAmountLessThanFee ? i18n.t("common.amount.withdrawal.less.than.fee") : undefined,
          errorActions: [<TextButton onClick={handleReclaim}>{i18n.t("common.reclaim")}</TextButton>],
          errorMessage: i18n.t("common.check.balance.tips"),
        },
  ];

  return contents.filter((e) => !!e).map((element, index) => ({ ...element, step: index })) as StepContents[];
}
