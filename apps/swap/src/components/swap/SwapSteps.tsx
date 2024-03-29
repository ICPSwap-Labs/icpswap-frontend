import { Box, Avatar } from "@mui/material";
import { Token } from "@icpswap/swap-sdk";
import { parseTokenAmount, BigNumber } from "@icpswap/utils";
import { t, Trans } from "@lingui/macro";
import { isUseTransfer } from "utils/token/index";
import { getSwapOutAmount } from "store/swap/hooks";
import { TextButton } from "components/index";

export interface GetStepsArgs {
  inputCurrency: Token;
  outputCurrency: Token;
  amount0: string;
  amount1: string;
  key: string;
  retry?: () => Promise<boolean>;
  handleReclaim: () => void;
}

export function getSwapStep({ inputCurrency, outputCurrency, amount0, amount1, key, handleReclaim }: GetStepsArgs) {
  const symbol0 = inputCurrency.symbol;
  const symbol1 = outputCurrency.symbol;
  const address0 = inputCurrency.wrapped.address;
  const logo0 = inputCurrency.logo;
  const logo1 = outputCurrency.logo;

  const outAmount = getSwapOutAmount(key);

  const amount0Value = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar sx={{ width: "16px", height: "16px", margin: "0 4px 0 0" }} src={logo0}>
        &nbsp;
      </Avatar>
      {amount0}
    </Box>
  );

  const amount1Value = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar sx={{ width: "16px", height: "16px", margin: "0 4px 0 0" }} src={logo1}>
        &nbsp;
      </Avatar>
      {amount1}
    </Box>
  );

  const outAmountValue = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar sx={{ width: "16px", height: "16px", margin: "0 4px 0 0" }} src={logo1}>
        &nbsp;
      </Avatar>
      {outAmount ? parseTokenAmount(outAmount, outputCurrency.decimals).toFormat() : "--"}
    </Box>
  );

  const withdrawAmountLessThanZero = outAmount
    ? new BigNumber(outAmount.toString()).minus(outputCurrency.transFee).isLessThan(0)
    : false;

  const isTokenInUseTransfer = isUseTransfer(inputCurrency.wrapped);

  const steps = [
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
      errorMessage: t`Please click Reclaim your tokens if they've transferred to the swap pool.`,
    },

    {
      title: t`Swap ${symbol0} to ${symbol1}`,
      step: 2,
      children: [
        { label: symbol0, value: amount0Value },
        { label: symbol1, value: amount1Value },
      ],
    },
    {
      title: withdrawAmountLessThanZero ? t`Unable to withdraw ${symbol1}` : t`Withdraw ${symbol1}`,
      step: 3,
      children: [{ label: symbol1, value: outAmountValue }],
      skipError: withdrawAmountLessThanZero ? t`The amount of withdrawal is less than the transfer fee` : undefined,
      errorActions: [
        <TextButton onClick={handleReclaim}>
          <Trans>Reclaim</Trans>
        </TextButton>,
      ],
      errorMessage: t`Please click Reclaim your tokens if they've transferred to the swap pool.`,
    },
  ];

  return steps;
}
