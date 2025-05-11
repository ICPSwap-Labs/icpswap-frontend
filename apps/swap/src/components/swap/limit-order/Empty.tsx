import { NoData, TextButton } from "@icpswap/ui";
import { Trans } from "react-i18next";

export function LimitTransactionsEmpty() {
  return (
    <NoData
      tip={
        <Trans
          components={{
            highlight: (
              <TextButton to="/swap/limit">
                <Trans>Place order</Trans>
              </TextButton>
            ),
          }}
          i18nKey="limit.transactions.empty"
        />
      }
    />
  );
}
