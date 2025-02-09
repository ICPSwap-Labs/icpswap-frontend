import { Box, Avatar } from "@mui/material";
import { parseTokenAmount } from "@icpswap/utils";
import { Position, Token } from "@icpswap/swap-sdk";
import { TextButton } from "components/index";
import { toFormat } from "utils/index";
import { isUseTransfer } from "utils/token/index";
import { StepContents, StepContent } from "types/step";
import type { PCMMetadata } from "@icpswap/types";
import { PassCodeManagerId } from "constants/canister";
import i18n from "i18n/index";

export interface GetAddLiquidityStepDetails {
  noLiquidity: boolean;
  position: Position | undefined;
  retry: () => void;
  handleReclaim: () => void;
  handleReclaimPCMBalance: () => void;
  pcmMetadata: PCMMetadata;
  pcmToken: Token;
  hasPassCode: boolean;
  needPayForPCM: boolean;
}

export function getAddLiquidityStepDetails({
  position,
  noLiquidity,
  retry,
  handleReclaim,
  handleReclaimPCMBalance,
  pcmMetadata,
  pcmToken,
  hasPassCode,
  needPayForPCM,
}: GetAddLiquidityStepDetails) {
  if (!position) return [];

  const { token0 } = position.pool;
  const { token1 } = position.pool;

  const symbol0 = position.pool.token0.symbol;
  const symbol1 = position.pool.token1.symbol;

  const amount0 = toFormat(parseTokenAmount(position.mintAmounts.amount0.toString(), token0.decimals).toString());
  const amount1 = toFormat(parseTokenAmount(position.mintAmounts.amount1.toString(), token1.decimals).toString());

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

  const originSteps: StepContent[] = [
    {
      title: isUseTransfer(token0) ? `Transfer ${symbol0}` : `Approve ${symbol0}`,
      children: [
        { label: i18n.t("common.amount"), value: amount0Value },
        { label: i18n.t("common.canister.id"), value: token0.address },
      ],
    },
    {
      title: i18n.t("common.deposit.amount", { amount: symbol0 }),
      children: [
        {
          label: i18n.t("common.amount"),
          value: amount0Value,
        },
        { label: i18n.t("common.canister.id"), value: token0.address },
      ],
      errorActions: [
        <>
          <TextButton onClick={handleReclaim}>{i18n.t("common.reclaim")}</TextButton>
        </>,
      ],
      errorMessage: i18n.t("common.check.balance.tips"),
    },
    {
      title: isUseTransfer(token1) ? `Transfer ${symbol1}` : `Approve ${symbol1}`,
      children: [
        { label: i18n.t("common.amount"), value: amount1Value },
        { label: i18n.t("common.canister.id"), value: token1.address },
      ],
    },
    {
      title: i18n.t("common.deposit.amount", { amount: symbol1 }),
      children: [
        {
          label: i18n.t("common.amount"),
          value: amount1Value,
        },
        { label: i18n.t("common.canister.id"), value: token1.address },
      ],
      errorActions: [
        <>
          <TextButton onClick={handleReclaim}>{i18n.t("common.reclaim")}</TextButton>
        </>,
      ],
      errorMessage: i18n.t("common.check.balance.tips"),
    },
    {
      title: `Add liquidity ${token0.symbol} and ${token1.symbol}`,
      children: [
        { label: symbol0, value: amount0Value },
        { label: symbol1, value: amount1Value },
      ],
      errorActions: [
        <TextButton onClick={handleReclaim}>{i18n.t("common.reclaim")}</TextButton>,
        <TextButton onClick={retry}>{i18n.t("common.retry")}</TextButton>,
      ],
      errorMessage: i18n.t("common.check.balance.tips"),
    },
  ];

  if (noLiquidity) {
    const pcmAmount = parseTokenAmount(pcmMetadata.passcodePrice, pcmToken.decimals);

    originSteps.unshift({
      title: `Create pool ${token0.symbol} and ${token1.symbol}`,
    });

    if (!hasPassCode) {
      originSteps.unshift({
        title: `Confirm payment and request permission`,
      });

      if (needPayForPCM) {
        originSteps.unshift({
          title: `Deposit ${pcmAmount.toFormat()} ${pcmToken.symbol} for creating swap pool fee`,
          children: [
            { label: i18n.t`Recipient canister ID`, value: PassCodeManagerId },
            { label: i18n.t`Deposit amount`, value: `${pcmAmount.toFormat()} ${pcmToken.symbol}` },
          ],
        });

        originSteps.unshift({
          title: isUseTransfer(pcmToken)
            ? `Transfer ${pcmToken.symbol} for creating swap pool fee`
            : `Approve ${pcmToken.symbol} for creating swap pool fee`,
          children: [
            { label: i18n.t`Recipient canister ID`, value: PassCodeManagerId },
            { label: i18n.t("common.amount"), value: `${pcmAmount.toFormat()} ${pcmToken.symbol}` },
          ],
          errorActions: [
            <>
              <TextButton onClick={handleReclaimPCMBalance}>{i18n.t("common.reclaim")}</TextButton>
            </>,
          ],
          errorMessage: i18n.t("common.check.balance.tips"),
        });
      }
    }
  }

  return originSteps
    .filter((step) => step !== undefined)
    .map((step, index) => ({ ...step, step: index }) as StepContents);
}
