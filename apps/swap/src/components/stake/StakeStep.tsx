import type { Token } from "@icpswap/swap-sdk";
import type { TOKEN_STANDARD } from "@icpswap/token-adapter";
import { parseTokenAmount } from "@icpswap/utils";
import { TokenImage } from "components/index";
import { Box } from "components/Mui";
import i18n from "i18n/index";
import { getStepData } from "store/steps/hooks";
import { toFormat } from "utils/index";
import { actualAmountToPool, isUseTransferByStandard } from "utils/token/index";

export interface GetSteps {
  token: Token;
  amount: string | number;
  standard: TOKEN_STANDARD;
  key: string;
  rewardToken: Token;
  retry?: () => void;
}

export function getSteps({ token, amount, standard, rewardToken, key }: GetSteps) {
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
        { label: i18n.t("common.amount"), value: amount0Value },
        { label: i18n.t("common.canister.id"), value: token.address },
      ],
    },
    {
      title: i18n.t("common.deposit.amount", { amount: token.symbol }),
      children: [
        {
          label: i18n.t("common.amount"),
          value: amount0Value,
        },
        { label: i18n.t("common.canister.id"), value: token.address },
      ],
    },
    {
      title: i18n.t("stake", { symbol: token.symbol }),
      children: [
        {
          label: i18n.t("common.amount"),
          value: amount0Value,
        },
        { label: i18n.t("common.canister.id"), value: token.address },
      ],
    },
    {
      title: i18n.t("common.withdraw.amount", { symbol: rewardToken.symbol }),
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
