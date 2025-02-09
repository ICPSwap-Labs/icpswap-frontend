import { Box } from "components/Mui";
import { parseTokenAmount } from "@icpswap/utils";
import { toFormat } from "utils/index";
import { Token } from "@icpswap/swap-sdk";
import { TokenImage } from "components/index";
import { getStepData } from "store/steps/hooks";
import i18n from "i18n/index";

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
      title: i18n.t("common.harvest.symbol", { symbol: token.symbol }),
    },
    {
      title: i18n.t("common.withdraw.amount", { symbol: token.symbol }),
      children: [
        {
          label: i18n.t("common.amount"),
          value: amount0Value,
        },
        { label: i18n.t("common.canister.id"), value: token.address },
      ],
    },
  ];

  return steps.filter((step) => step !== undefined).map((step, index) => ({ ...step, step: index }));
}
