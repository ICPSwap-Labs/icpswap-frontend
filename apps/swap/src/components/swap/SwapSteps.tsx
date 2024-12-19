import { Box } from "components/Mui";
import { Token } from "@icpswap/swap-sdk";
import { parseTokenAmount, BigNumber } from "@icpswap/utils";
import { t, Trans } from "@lingui/macro";
import { isUseTransfer } from "utils/token/index";
import { getSwapOutAmount } from "store/swap/hooks";
import { TextButton, TokenImage } from "components/index";
import type { StepContents } from "types/step";

export interface GetStepsArgs {
  inputCurrency: Token;
  outputCurrency: Token;
  amount0: string;
  amount1: string;
  key: string;
  retry?: () => Promise<boolean>;
  handleReclaim: () => void;
  keepTokenInPools: boolean;
}

export function getSwapStep({
  inputCurrency,
  outputCurrency,
  key,
  amount0,
  amount1,
  handleReclaim,
  keepTokenInPools,
}: GetStepsArgs) {
  const symbol0 = inputCurrency.symbol;
  const symbol1 = outputCurrency.symbol;
  const address0 = inputCurrency.wrapped.address;
  const logo0 = inputCurrency.logo;
  const logo1 = outputCurrency.logo;

  const outAmount = getSwapOutAmount(key);

  const amount0Value = (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}>
      <TokenImage size="16px" logo={logo0} tokenId={inputCurrency.address} />
      {amount0}
    </Box>
  );

  const amount1Value = (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}>
      <TokenImage size="16px" logo={logo1} tokenId={outputCurrency.address} />
      {amount1}
    </Box>
  );

  const outAmountValue = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <TokenImage size="16px" logo={logo1} tokenId={outputCurrency.address} />
      {outAmount ? parseTokenAmount(outAmount, outputCurrency.decimals).toFormat() : "--"}
    </Box>
  );

  const withdrawAmountLessThanZero = outAmount
    ? new BigNumber(outAmount.toString()).minus(outputCurrency.transFee).isLessThan(0)
    : false;

  const isTokenInUseTransfer = isUseTransfer(inputCurrency.wrapped);

  const steps: StepContents[] = [
    {
      title: isTokenInUseTransfer ? `Transfer ${symbol0}` : `Approve ${symbol0}`,
      step: 0,
      children: [
        { label: t`Amount`, value: amount0Value },
        { label: t`Canister Id`, value: address0 },
      ],
    },
    {
      title: t`Deposit ${symbol0}`,
      step: 1,
      children: [
        {
          label: t`Amount`,
          value: amount0Value,
        },
        { label: t`Canister Id`, value: address0 },
      ],
      errorActions: [
        <TextButton onClick={handleReclaim}>
          <Trans>Reclaim</Trans>
        </TextButton>,
      ],
      errorMessage: t`Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool.`,
    },

    {
      title: t`Swap ${symbol0} to ${symbol1}`,
      step: 2,
      children: [
        { label: symbol0, value: amount0Value },
        { label: symbol1, value: amount1Value },
      ],
    },
  ];

  if (!keepTokenInPools) {
    steps.push({
      title: !outAmount
        ? t`Withdraw ${symbol1}`
        : withdrawAmountLessThanZero
        ? t`Unable to withdraw ${symbol1}`
        : t`Withdraw ${symbol1}`,
      step: 3,
      children: [{ label: symbol1, value: outAmountValue }],
      skipError: withdrawAmountLessThanZero ? t`The amount of withdrawal is less than the transfer fee` : undefined,
    });
  }

  return steps;
}
