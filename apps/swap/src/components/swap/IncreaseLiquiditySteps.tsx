import { Box, Avatar } from "components/Mui";
import { Position } from "@icpswap/swap-sdk";
import { parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { isUseTransfer } from "utils/token/index";
import { StepContents } from "types/step";
import { TextButton } from "components/index";
import i18n from "i18n/index";

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
        { label: i18n.t("common.amount"), value: amount0Value },
        { label: i18n.t("common.canister.id"), value: position.pool.token0.address },
      ],
    },
    {
      title: i18n.t("common.deposit.amount", { amount: symbol0 }),
      step: 1,
      children: [
        {
          label: i18n.t("common.amount"),
          value: amount0Value,
        },
        { label: i18n.t("common.canister.id"), value: position.pool.token0.address },
      ],
      errorActions: [
        <>
          <TextButton onClick={handleReclaim}>{i18n.t("common.reclaim")}</TextButton>
        </>,
      ],
      errorMessage: i18n.t("common.check.balance.tips"),
    },
    {
      title: isToken1UseTransfer
        ? i18n.t("swap.transfer", { symbol: symbol1 })
        : i18n.t("swap.approve", { symbol: symbol1 }),
      step: 2,
      children: [
        { label: i18n.t("common.amount"), value: amount1Value },
        { label: i18n.t("common.canister.id"), value: position.pool.token1.address },
      ],
    },
    {
      title: i18n.t("common.deposit.amount", { amount: symbol1 }),
      step: 3,
      children: [
        {
          label: i18n.t("common.amount"),
          value: amount1Value,
        },
        { label: i18n.t("common.canister.id"), value: position.pool.token1.address },
      ],
      errorActions: [
        <>
          <TextButton onClick={handleReclaim}>{i18n.t("common.reclaim")}</TextButton>
        </>,
      ],
      errorMessage: i18n.t("common.check.balance.tips"),
    },
    {
      title: i18n.t("swap.increase.liquidity", {
        symbol0: position.pool.token0.symbol,
        symbol1: position.pool.token1.symbol,
      }),
      step: 4,
      children: [
        { label: symbol0, value: amount0Value },
        { label: symbol1, value: amount1Value },
      ],
      errorActions: [
        <>
          <TextButton onClick={handleReclaim}>{i18n.t("common.reclaim")}</TextButton>
        </>,
      ],
      errorMessage: i18n.t("common.check.balance.tips"),
    },
  ] as StepContents[];
}
