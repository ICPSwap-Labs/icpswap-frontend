import { useEffect, useMemo } from "react";
import { Connector } from "constants/index";
import { useConnector } from "store/auth/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useErrorTip } from "hooks/useTips";
import { OisyDisabledTips, type OisyDisabledPage } from "components/OisyDisabledTips";

export interface UseOisyDisabledProps {
  page: OisyDisabledPage;
  noTips?: boolean;
}

export function useOisyDisabledTips({ page, noTips = false }: UseOisyDisabledProps) {
  const connector = useConnector();
  const [openErrorTip] = useErrorTip();

  useEffect(() => {
    if (isUndefinedOrNull(connector)) return;

    if (connector === Connector.Oisy && noTips === false) {
      openErrorTip(<OisyDisabledTips page={page} />, { autoHideDuration: 10000 });
    }
  }, [connector, noTips]);

  return useMemo(() => {
    if (isUndefinedOrNull(connector)) return true;
    return connector === Connector.Oisy;
  }, [connector]);
}
