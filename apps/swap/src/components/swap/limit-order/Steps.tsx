import { Typography } from "components/Mui";
import { parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Position, tickToPrice, Token } from "@icpswap/swap-sdk";
import { Flex, TextButton, TokenImage } from "components/index";
import { isUseTransfer } from "utils/token/index";
import { StepContents, StepContent } from "types/step";
import i18n from "i18n/index";

export interface GetLimitOrderStepsProps {
  position: Position | undefined;
  retry: () => void;
  handleReclaim: (poolId: string) => void;
  inputToken: Token;
}

export function getLimitOrderSteps({
  position,
  inputToken,
  retry,
  handleReclaim: __handleReclaim,
}: GetLimitOrderStepsProps) {
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

  const handleReclaim = () => {
    __handleReclaim(position.pool.id);
  };

  const originSteps: StepContent[] = [
    {
      title: isUseTransfer(inputToken) ? `Transfer ${inputToken.symbol}` : `Approve ${inputToken.symbol}`,
      children: [
        { label: i18n.t("common.amount"), value: InputTokenAmount },
        { label: i18n.t("common.canister.id"), value: inputToken.address },
      ],
    },
    {
      title: i18n.t("common.deposit.amount", { amount: inputToken.symbol }),
      children: [
        {
          label: i18n.t("common.amount"),
          value: InputTokenAmount,
        },
        { label: i18n.t("common.canister.id"), value: inputToken.address },
      ],
      errorActions: [
        <>
          <TextButton onClick={handleReclaim}>{i18n.t("common.reclaim")}</TextButton>
        </>,
      ],
      errorMessage: i18n.t("common.check.balance.tips"),
    },
    {
      title: (
        <Typography color="text.primary" fontWeight={500} fontSize="16px">
          {i18n.t("limit.set.order")}
        </Typography>
      ),
      children: [
        { label: i18n.t("common.limit.price"), value: LimitPrice },
        { label: i18n.t("common.price.range"), value: PriceRange },
        { label: i18n.t("common.you.pay"), value: InputTokenAmount },
      ],
      errorActions: [
        <TextButton key="reclaim" onClick={handleReclaim}>
          {i18n.t("common.reclaim")}
        </TextButton>,
        <TextButton key="retry" onClick={retry}>
          {i18n.t("common.retry")}
        </TextButton>,
      ],
      errorMessage: i18n.t("common.check.balance.tips"),
    },
    {
      title: i18n.t("limit.submit"),
      children: [
        { label: i18n.t("common.limit.price"), value: LimitPrice },
        { label: i18n.t("common.you.pay"), value: InputTokenAmount },
        { label: i18n.t("limit.expect.receive"), value: OutputTokenAmount },
      ],
    },
  ];

  return originSteps
    .filter((step) => step !== undefined)
    .map((step, index) => ({ ...step, step: index }) as StepContents);
}
