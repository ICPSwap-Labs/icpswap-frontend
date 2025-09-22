import { Typography } from "components/Mui";
import type { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { isUndefinedOrNull } from "@icpswap/utils";

export interface LastSyncBlockProps {
  minterInfo: ChainKeyETHMinterInfo | Null;
  erc20?: boolean;
}

export function LastSyncBlock({ minterInfo, erc20 }: LastSyncBlockProps) {
  const { t } = useTranslation();

  const last_block = useMemo(() => {
    if (isUndefinedOrNull(minterInfo)) return undefined;
    return erc20 ? minterInfo.last_erc20_scraped_block_number[0] : minterInfo.last_eth_scraped_block_number[0];
  }, [minterInfo, erc20]);

  return (
    <Typography sx={{ margin: "8px 0 0 0", fontSize: "12px" }}>
      {t("ether.latest.block", {
        block: last_block ? last_block.toString() : "--",
        chain: erc20 ? "erc20" : "Ethereum",
      })}
    </Typography>
  );
}
