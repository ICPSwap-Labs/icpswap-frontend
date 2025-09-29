import { useCallback, useMemo } from "react";
import {
  BigNumber,
  formatAmount,
  formatDollarAmount,
  isUndefinedOrNull,
  nonUndefinedOrNull,
  parseTokenAmount,
} from "@icpswap/utils";
import { Confirm } from "components/Wallet/Confirm";
import { useTranslation } from "react-i18next";
import { useWalletContext } from "components/Wallet/context";
import { useConvertCallback } from "hooks/wallet/useConvertCallback";
import { useUSDPrice } from "hooks/index";
import { Box, Typography } from "components/Mui";
import { ICP } from "@icpswap/tokens";

export function ConvertToIcpConfirm() {
  const { t } = useTranslation();
  const { tokensConvertToSwap, setTokensConvertToIcp, convertLoading } = useWalletContext();
  const icpPrice = useUSDPrice(ICP);
  const { callback: convertTokensToIcp } = useConvertCallback();

  const handleCancel = useCallback(() => {
    setTokensConvertToIcp(undefined);
  }, [setTokensConvertToIcp]);

  const totalIcpAmount = useMemo(() => {
    if (isUndefinedOrNull(tokensConvertToSwap)) return undefined;

    const totalIcpAmount = tokensConvertToSwap.reduce((prev, curr) => {
      return prev.plus(curr.icpAmount);
    }, new BigNumber(0));

    return parseTokenAmount(totalIcpAmount, ICP.decimals).toString();
  }, [tokensConvertToSwap]);

  const totalUsdValue = useMemo(() => {
    if (isUndefinedOrNull(totalIcpAmount) || isUndefinedOrNull(icpPrice)) return undefined;

    return new BigNumber(totalIcpAmount).multipliedBy(icpPrice).toString();
  }, [totalIcpAmount, icpPrice]);

  return (
    <Confirm
      open={nonUndefinedOrNull(tokensConvertToSwap) && tokensConvertToSwap.length > 0 && convertLoading === false}
      title="Confirm order"
      content={
        <Box>
          <Typography align="center">{t("common.will.receive")}</Typography>
          <Typography sx={{ margin: "16px 0 0 0", fontSize: "20px", fontWeight: 600, color: "#fff" }} align="center">
            {totalIcpAmount ? `${formatAmount(totalIcpAmount)} ICP` : "--"}
          </Typography>
          <Typography sx={{ margin: "8px 0 0 0" }} align="center">
            {totalUsdValue ? `${formatDollarAmount(totalUsdValue)}` : "--"}
          </Typography>
        </Box>
      }
      onCancel={handleCancel}
      onConfirm={convertTokensToIcp}
      noCancel
      confirmLoading={convertLoading}
    />
  );
}
