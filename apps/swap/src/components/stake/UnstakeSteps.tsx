import { Box } from "components/Mui";
import { parseTokenAmount } from "@icpswap/utils";
import { t } from "@lingui/macro";
import { toFormat } from "utils/index";
import { Token } from "@icpswap/swap-sdk";
import { TokenImage } from "components/index";
// import { getStepData } from "store/steps/hooks";

export interface GetSteps {
  token: Token;
  rewardToken: Token;
  amount: string | number;
  key: string;
  retry?: () => void;
}

export function getUnstakeSteps({ token, amount }: GetSteps) {
  // const data = getStepData<bigint | undefined>(key);
  const amount0 = toFormat(parseTokenAmount(amount, token.decimals).toString());

  const amount0Value = (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}>
      <TokenImage logo={token.logo} tokenId={token.address} size="16px" />
      {amount0}
    </Box>
  );

  const steps: any[] = [
    {
      title: t`Unstake ${token.symbol}`,
      children: [
        {
          label: t`Amount`,
          value: amount0Value,
        },
        { label: t`Canister Id`, value: token.address },
      ],
    },
    // {
    //   title: t`Withdraw ${token.symbol}`,
    //   children: [
    //     {
    //       label: t`Amount`,
    //       value: amount0Value,
    //     },
    //     { label: t`Canister Id`, value: token.address },
    //   ],
    // },
    // {
    //   title: t`Withdraw ${rewardToken.symbol}`,
    //   children: [
    //     { label: rewardToken.symbol, value: data ? parseTokenAmount(data, rewardToken.decimals).toFormat() : "--" },
    //   ],
    //   skipError:
    //     data && Number(data) < rewardToken.transFee
    //       ? t`The amount of withdrawal is less than the transfer fee`
    //       : undefined,
    //   errorMessage: t`Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool.`,
    // },
  ];

  return steps.filter((step) => step !== undefined).map((step, index) => ({ ...step, step: index }));
}
