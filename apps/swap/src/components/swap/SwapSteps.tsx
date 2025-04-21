import { Typography } from "components/Mui";
import { Token } from "@icpswap/swap-sdk";
import { isUseTransfer } from "utils/token/index";
import { Flex, TokenImage } from "components/index";
import type { StepContents } from "types/step";
import { ArrowRight } from "react-feather";
import i18n from "i18n";
import themeColors from "theme/colors";

export interface ConsolidatedSwapStepsProps {
  inputToken: Token;
  outputToken: Token;
  amount0: string;
  amount1: string;
  key: string;
  retry?: () => Promise<boolean>;
}

export function getSwapSteps({ inputToken, outputToken, amount0, amount1 }: ConsolidatedSwapStepsProps) {
  const symbol0 = inputToken.symbol;
  const symbol1 = outputToken.symbol;
  const logo0 = inputToken.logo;
  const logo1 = outputToken.logo;

  const isTokenInUseTransfer = isUseTransfer(inputToken.wrapped);

  const steps: StepContents[] = [
    {
      title: isTokenInUseTransfer ? `Transfer ${symbol0}` : `Approve ${symbol0}`,
      step: 0,
    },
    {
      title: i18n.t("swap.to", { symbol0, symbol1 }),
      step: 1,
      description: (
        <Flex gap="0 4px" align="center">
          <Flex gap="0 4px">
            <TokenImage size="16px" logo={logo0} tokenId={inputToken.address} />
            <Typography>
              {amount0} {symbol0}
            </Typography>
          </Flex>

          <ArrowRight size={14} color={themeColors.darkTextSecondary} />

          <Flex gap="0 4px">
            <TokenImage size="16px" logo={logo1} tokenId={inputToken.address} />
            <Typography>
              {amount1} {symbol1}
            </Typography>
          </Flex>
        </Flex>
      ),
    },
  ];

  return steps;
}
