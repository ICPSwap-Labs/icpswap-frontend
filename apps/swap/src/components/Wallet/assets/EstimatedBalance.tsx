import { useCallback, useMemo } from "react";
import { useWalletContext } from "components/Wallet/context";
import { useICPPrice, useRefreshTriggerManager } from "hooks/index";
import { EstimatedBalanceUI } from "components/Wallet/assets/EstimatedBalanceUI";
import { useTranslation } from "react-i18next";
import { TOKEN_ASSETS_REFRESH } from "constants/wallet";

export function EstimatedBalance() {
  const { t } = useTranslation();
  const icpPrice = useICPPrice();
  const { totalValue, totalUSDBeforeChange } = useWalletContext();
  const [, setRefreshTrigger] = useRefreshTriggerManager(TOKEN_ASSETS_REFRESH);

  const useTotalICPValue = useMemo(() => {
    if (icpPrice) return totalValue.dividedBy(icpPrice);
    return undefined;
  }, [totalValue, icpPrice]);

  const usdChange = useMemo(() => {
    if (totalValue.isEqualTo(0) || totalUSDBeforeChange.isEqualTo(0)) return undefined;
    return `${totalValue.minus(totalUSDBeforeChange).dividedBy(totalUSDBeforeChange).multipliedBy(100).toFixed(2)}%`;
  }, [totalUSDBeforeChange, totalValue]);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger();
  }, [setRefreshTrigger]);

  return (
    <EstimatedBalanceUI
      title={t("wallet.estimated.balance")}
      icpValue={useTotalICPValue?.toString()}
      usdValue={totalValue.toString()}
      valueChange={usdChange}
      showButtons
      onRefresh={handleRefresh}
    />
  );
}
