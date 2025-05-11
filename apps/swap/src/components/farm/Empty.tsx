import { NoData, TextButton } from "@icpswap/ui";
import { Trans } from "react-i18next";

export function YourFarmEmpty() {
  return (
    <NoData
      tip={
        <Trans
          components={{
            highlight: <TextButton to="/farm?state=LIVE" />,
          }}
          i18nKey="farm.your.empty"
        />
      }
    />
  );
}
