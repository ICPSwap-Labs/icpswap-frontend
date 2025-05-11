import { NoData, TextButton } from "@icpswap/ui";
import { Trans } from "react-i18next";

export function UserLiquidityEmpty() {
  return (
    <NoData
      tip={
        <Trans
          components={{
            highlight: (
              <TextButton to="/liquidity">
                <Trans>Add liquidity</Trans>
              </TextButton>
            ),
          }}
          i18nKey="liquidity.transactions.empty"
        />
      }
    />
  );
}
