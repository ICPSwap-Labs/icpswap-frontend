import { Box } from "components/Mui";
import { parseTokenAmount } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { t } from "@lingui/macro";
import { toFormat } from "utils/index";
import { isUseTransferByStandard, actualAmountToPool } from "utils/token/index";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";
import { getStepData } from "store/steps/hooks";
import { TokenImage } from "components/index";

export interface GetSteps {
  token: Token;
  amount: string | number;
  standard: TOKEN_STANDARD;
  key: string;
  rewardToken: Token;
  retry?: () => void;
}

export function getSteps({ token, rewardToken, amount, standard, key }: GetSteps) {
  const amount0 = toFormat(parseTokenAmount(actualAmountToPool(token, String(amount)), token.decimals).toString());
  const data = getStepData<bigint | undefined>(key);

  const amount0Value = (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}>
      <TokenImage logo={token.logo} tokenId={token.address} size="16px" />
      {amount0}
    </Box>
  );

  const steps: any[] = [
    {
      title: isUseTransferByStandard(standard) ? `Transfer ${token.symbol}` : `Approve ${token.symbol}`,
      children: [
        { label: t`Amount`, value: amount0Value },
        { label: t`Canister Id`, value: token.address },
      ],
    },
    {
      title: t`Deposit ${token.symbol}`,
      children: [
        {
          label: t`Amount`,
          value: amount0Value,
        },
        { label: t`Canister Id`, value: token.address },
      ],
    },
    {
      title: t`Stake ${token.symbol}`,
      children: [
        {
          label: t`Amount`,
          value: amount0Value,
        },
        { label: t`Canister Id`, value: token.address },
      ],
    },
    {
      title: t`Withdraw ${rewardToken.symbol}`,
      children: [
        { label: rewardToken.symbol, value: data ? parseTokenAmount(data, rewardToken.decimals).toFormat() : "--" },
      ],
      skipError:
        data && Number(data) < rewardToken.transFee
          ? t`The amount of withdrawal is less than the transfer fee`
          : undefined,
      errorMessage: t`Please click Reclaim your tokens if they've transferred to the swap pool.`,
    },
  ];

  return steps.filter((step) => step !== undefined).map((step, index) => ({ ...step, step: index }));
}
