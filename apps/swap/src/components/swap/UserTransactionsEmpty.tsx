import { NoData, TextButton } from "@icpswap/ui";
import { Trans } from "react-i18next";

export interface UserTransactionsEmptyProps {
  onClick?: () => void;
}

export function UserTransactionsEmpty({ onClick }: UserTransactionsEmptyProps) {
  return (
    <NoData
      tip={
        <Trans
          components={{
            highlight: (
              <TextButton to="/swap" onClick={onClick}>
                <Trans>begin swap</Trans>
              </TextButton>
            ),
          }}
          i18nKey="swap.transactions.empty"
        />
      }
    />
  );
}
