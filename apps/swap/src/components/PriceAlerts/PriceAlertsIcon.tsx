import { usePriceAlerts } from "@icpswap/hooks";
import { Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { Box, useTheme } from "components/Mui";
import { PriceAlerts } from "components/PriceAlerts/PriceAlerts";
import { useEffect, useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useAlertsOpenManager, useAlertsRefetchManager } from "./state";

export function PriceAlertsIcons({ hasAlerts }: { hasAlerts: boolean }) {
  const theme = useTheme();
  const [, setAlertsOpen] = useAlertsOpenManager();

  return (
    <>
      <Box
        sx={{
          width: "36px",
          height: "36px",
          borderRadius: "12px",
          background: theme.palette.background.level4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={() => setAlertsOpen(true)}
      >
        {hasAlerts ? (
          <img src="/images/swap/price-alerts-added.svg" alt="" />
        ) : (
          <img src="/images/swap/price-alerts-add.svg" alt="" />
        )}
      </Box>
    </>
  );
}

interface PriceAlertsIconProps {
  tokenId: string | Null;
}

export function PriceAlertsIcon({ tokenId }: PriceAlertsIconProps) {
  const principal = useAccountPrincipalString();
  const queryResult = usePriceAlerts(principal);
  const [alertsOpen, setAlertsOpen] = useAlertsOpenManager();
  const [, setAlertsRefetch] = useAlertsRefetchManager();

  const { data, isPending } = queryResult;

  useEffect(() => {
    setAlertsRefetch(queryResult);
  }, [queryResult?.refetch, setAlertsRefetch]);

  const hasAlerts = useMemo(() => {
    if (isUndefinedOrNull(tokenId) || isUndefinedOrNull(data)) return undefined;
    return !!data.find((element) => element.tokenId === tokenId);
  }, [data, tokenId]);

  return (
    <>
      {isUndefinedOrNull(hasAlerts) ? null : <PriceAlertsIcons hasAlerts={hasAlerts} />}
      {alertsOpen ? (
        <PriceAlerts open={alertsOpen} onClose={() => setAlertsOpen(false)} isPending={isPending} alerts={data} />
      ) : null}
    </>
  );
}
