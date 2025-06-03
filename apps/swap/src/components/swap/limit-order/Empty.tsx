import { NoData, TextButton } from "@icpswap/ui";
import { Trans } from "react-i18next";

export interface LimitTransactionsEmptyProps {
  onClick?: () => void;
}

export function LimitTransactionsEmpty({ onClick }: LimitTransactionsEmptyProps) {
  return (
    <NoData
      tip={
        <Trans
          components={{
            highlight: (
              <TextButton to="/swap/limit" onClick={onClick}>
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
