import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Avatar, Box } from "components/Mui";
import { BURN_FIELD } from "constants/swap";
import i18n from "i18n/index";
import type { StepContents } from "types/step";
import { toFormat } from "utils/index";

export interface DecreaseLiquidityStepsProps {
  formattedAmounts: { [key in BURN_FIELD]?: string };
  currencyA: Token | undefined;
  currencyB: Token | undefined;
  positionId: bigint | Null;
}

function TokenAmount({ logo, amount }: { logo: string; amount: string | undefined }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar sx={{ width: "16px", height: "16px", margin: "0 4px 0 0" }} src={logo}>
        &nbsp;
      </Avatar>
      {amount ?? "--"}
    </Box>
  );
}

export function getDecreaseLiquiditySteps({
  formattedAmounts,
  currencyA,
  currencyB,
  positionId,
}: DecreaseLiquidityStepsProps) {
  const contents =
    currencyA && currencyB && positionId
      ? [
          {
            title: `Remove liquidity ${currencyA?.symbol} and ${currencyB.symbol}`,
            step: 0,
            children: [
              { label: i18n.t("common.position.id"), value: positionId.toString() },
              {
                label: `${currencyA.symbol}`,
                value: <TokenAmount amount={toFormat(formattedAmounts[BURN_FIELD.CURRENCY_A])} logo={currencyA.logo} />,
              },
              {
                label: `${currencyB.symbol}`,
                value: <TokenAmount amount={toFormat(formattedAmounts[BURN_FIELD.CURRENCY_B])} logo={currencyB.logo} />,
              },
            ],
          },
        ]
      : [];

  return contents.filter((e) => !!e) as StepContents[];
}
