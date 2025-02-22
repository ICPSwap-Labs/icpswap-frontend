import { Typography } from "components/Mui";
import { useFinalizedBlockNumber } from "hooks/web3/useBlockNumber";
import { useTranslation } from "react-i18next";

export function EthereumFinalizedBlock() {
  const blockNumber = useFinalizedBlockNumber();
  const { t } = useTranslation();

  return blockNumber ? (
    <Typography sx={{ fontSize: "12px" }}>{t("ether.finalized.block", { block: blockNumber })}</Typography>
  ) : null;
}
