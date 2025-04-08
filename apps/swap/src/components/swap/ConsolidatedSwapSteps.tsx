import { Box } from "components/Mui";
import { Token } from "@icpswap/swap-sdk";
import { isUseTransfer } from "utils/token/index";
import { TokenImage } from "components/index";
import type { StepContents } from "types/step";
import i18n from "i18n";

export interface ConsolidatedSwapStepsProps {
  inputToken: Token;
  outputToken: Token;
  amount0: string;
  amount1: string;
  key: string;
  retry?: () => Promise<boolean>;
}

export function getConsolidatedSwapStep({ inputToken, outputToken, amount0, amount1 }: ConsolidatedSwapStepsProps) {
  const symbol0 = inputToken.symbol;
  const symbol1 = outputToken.symbol;
  const address0 = inputToken.wrapped.address;
  const logo0 = inputToken.logo;
  const logo1 = outputToken.logo;

  const amount0Value = (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}>
      <TokenImage size="16px" logo={logo0} tokenId={inputToken.address} />
      {amount0}
    </Box>
  );

  const amount1Value = (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}>
      <TokenImage size="16px" logo={logo1} tokenId={outputToken.address} />
      {amount1}
    </Box>
  );

  const isTokenInUseTransfer = isUseTransfer(inputToken.wrapped);

  const steps: StepContents[] = [
    {
      title: isTokenInUseTransfer ? `Transfer ${symbol0}` : `Approve ${symbol0}`,
      step: 0,
      children: [
        { label: i18n.t("common.amount"), value: amount0Value },
        { label: i18n.t("common.canister.id"), value: address0 },
      ],
    },
    {
      title: i18n.t("swap.to", { symbol0, symbol1 }),
      step: 1,
      children: [
        { label: symbol0, value: amount0Value },
        { label: symbol1, value: amount1Value },
      ],
    },
  ];

  return steps;
}
