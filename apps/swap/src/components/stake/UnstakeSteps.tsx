import { Box } from "components/Mui";
import { parseTokenAmount } from "@icpswap/utils";
import { toFormat } from "utils/index";
import { Token } from "@icpswap/swap-sdk";
import { TokenImage } from "components/index";
import { getStepData } from "store/steps/hooks";
import i18n from "i18n/index";

export interface GetSteps {
  token: Token;
  rewardToken: Token;
  amount: string | number;
  key: string;
  retry?: () => void;
}

export function getUnstakeSteps({ token, amount, rewardToken, key }: GetSteps) {
  const data = getStepData<bigint | undefined>(key);
  const amount0 = toFormat(parseTokenAmount(amount, token.decimals).toString());

  const amount0Value = (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 4px" }}>
      <TokenImage logo={token.logo} tokenId={token.address} size="16px" />
      {amount0}
    </Box>
  );

  const steps: any[] = [
    {
      title: i18n.t("stake.unstake.symbol", { symbol: token.symbol }),
      children: [
        {
          label: i18n.t("common.amount"),
          value: amount0Value,
        },
        { label: i18n.t("common.canister.id"), value: token.address },
      ],
    },
    {
      title: i18n.t("stake.withdraw.staked.amount", { symbol: token.symbol }),
      children: [
        {
          label: i18n.t("common.amount"),
          value: amount0Value,
        },
        { label: i18n.t("common.canister.id"), value: token.address },
      ],
    },
    {
      title: i18n.t("stake.withdraw.earned.amount", { symbol: rewardToken.symbol }),
      children: [
        { label: rewardToken.symbol, value: data ? parseTokenAmount(data, rewardToken.decimals).toFormat() : "--" },
      ],
      skipError:
        data && Number(data) < rewardToken.transFee ? i18n.t("common.amount.withdrawal.less.than.fee") : undefined,
      errorMessage: i18n.t("common.check.balance.tips"),
    },
  ];

  return steps.filter((step) => step !== undefined).map((step, index) => ({ ...step, step: index }));
}
