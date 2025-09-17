import { Typography } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";
import { SelectPair } from "components/Select/SelectPair";

interface LimitPendingTabOptionsProps {
  onPairChange: (pair: string | undefined) => void;
  pair: string | Null;
}

export function LimitPendingTabOptions({ pair, onPairChange }: LimitPendingTabOptionsProps) {
  const { t } = useTranslation();

  return (
    <>
      <Flex
        gap="0 12px"
        sx={{
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: "12px 0",
            alignItems: "flex-start",
          },
        }}
      >
        <Flex
          gap="0 4px"
          sx={{
            width: "fit-content",
            "@media(max-width: 640px)": {
              justifyContent: "flex-start",
            },
          }}
          justify="flex-end"
        >
          <Typography>{t("common.select.pair.colon")}</Typography>
          <SelectPair
            value={pair}
            panelPadding="0"
            showClean={false}
            onPairChange={onPairChange}
            search
            allPair
            showBackground={false}
          />
        </Flex>
      </Flex>

      {pair === "ALL PAIR" ? (
        <Typography sx={{ fontSize: "12px" }}>Fetching multiple limit orders may take some time.</Typography>
      ) : null}
    </>
  );
}
