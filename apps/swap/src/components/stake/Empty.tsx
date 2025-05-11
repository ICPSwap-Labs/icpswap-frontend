import { NoData, TextButton } from "@icpswap/ui";
import { Trans } from "react-i18next";

export function YourPoolsEmpty() {
  return (
    <NoData
      tip={
        <Trans
          components={{
            highlight: <TextButton to="/stake?state=LIVE" />,
          }}
          i18nKey="stake.your.empty"
        />
      }
    />
  );
}
