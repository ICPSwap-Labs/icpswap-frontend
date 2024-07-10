import { Box } from "components/Mui";
import { parseTokenAmount } from "@icpswap/utils";
import { t } from "@lingui/macro";
import { toFormat } from "utils/index";
import { Token } from "@icpswap/swap-sdk";
import { TokenImage } from "components/index";
import { getStepData } from "store/steps/hooks";

export interface GetStepsProps {
  token: Token;
  key: string;
  retry?: () => void;
}

export function getHarvestSteps({ token, key }: GetStepsProps) {
  const harvestAmount = getStepData<bigint | undefined>(key);

  const amount0 = harvestAmount ? toFormat(parseTokenAmount(harvestAmount, token.decimals).toString()) : "--";

  const amount0Value = (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}>
      <TokenImage logo={token.logo} tokenId={token.address} size="16px" />
      {amount0}
    </Box>
  );

  const steps: any[] = [
    {
      title: t`Harvest ${token.symbol}`,
    },
    {
      title: t`Withdraw ${token.symbol}`,
      children: [
        {
          label: t`Amount`,
          value: amount0Value,
        },
        { label: t`Canister Id`, value: token.address },
      ],
    },
  ];

  return steps.filter((step) => step !== undefined).map((step, index) => ({ ...step, step: index }));
}
