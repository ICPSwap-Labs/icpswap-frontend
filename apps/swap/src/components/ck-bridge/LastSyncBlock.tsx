import { Typography } from "components/Mui";
import type { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";

export interface LastSyncBlockProps {
  minterInfo: ChainKeyETHMinterInfo | Null;
}

export function LastSyncBlock({ minterInfo }: LastSyncBlockProps) {
  const { t } = useTranslation();

  return (
    <Typography sx={{ margin: "8px 0 0 0", fontSize: "12px" }}>
      {t("ether.latest.block", { block: minterInfo?.last_erc20_scraped_block_number[0]?.toString() ?? "--" })}
    </Typography>
  );
}
