import { useMemo } from "react";
import { useUSDPrice } from "hooks/index";
import { EstimatedBalanceUI } from "components/Wallet/assets/EstimatedBalanceUI";
import { AddressOverview, Null } from "@icpswap/types";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";
import { useTranslation } from "react-i18next";

interface DistributionEstimatedBalanceProps {
  addressOverview: AddressOverview | Null;
  onRefresh?: () => void;
}

export function DistributionEstimatedBalance({ addressOverview, onRefresh }: DistributionEstimatedBalanceProps) {
  const { t } = useTranslation();
  const icpPrice = useUSDPrice(ICP);

  const { icpValue, usdValue } = useMemo(() => {
    if (isUndefinedOrNull(addressOverview)) return {};

    const usdValue = new BigNumber(addressOverview.tokenValue)
      .plus(addressOverview.farmValue)
      .plus(addressOverview.farmValue)
      .plus(addressOverview.limitOrderValue)
      .plus(addressOverview.positionValue)
      .plus(addressOverview.stakeValue);

    const icpValue = icpPrice ? usdValue.dividedBy(icpPrice) : undefined;

    return { usdValue: usdValue.toString(), icpValue: icpValue?.toString() };
  }, [addressOverview, icpPrice]);

  return (
    <EstimatedBalanceUI
      title={t("wallet.estimated.total.balance")}
      onRefresh={onRefresh}
      icpValue={icpValue}
      usdValue={usdValue}
      noValueChange
    />
  );
}
