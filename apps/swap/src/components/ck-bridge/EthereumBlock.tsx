import { Typography } from "components/Mui";
import { useBlockNumber } from "hooks/web3/useBlockNumber";
import { useTranslation } from "react-i18next";

export function EthereumBlock() {
  const blockNumber = useBlockNumber();
  const { t } = useTranslation();

  return blockNumber ? (
    <Typography sx={{ fontSize: "12px" }}>{t("ck.ether.block.height", { block: blockNumber })}</Typography>
  ) : null;
}
