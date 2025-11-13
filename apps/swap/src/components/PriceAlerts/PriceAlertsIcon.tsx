import { usePriceAlerts } from "@icpswap/hooks";
import { Null } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { Box, useTheme } from "components/Mui";
import { PriceAlerts } from "components/PriceAlerts/PriceAlerts";
import { useMemo, useState } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";

export function PriceAlertsIcons({ hasAlerts }: { hasAlerts: boolean }) {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);

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
        onClick={() => setOpen(true)}
      >
        {hasAlerts ? (
          <img src="/images/swap/price-alerts-added.svg" alt="" />
        ) : (
          <img src="/images/swap/price-alerts-add.svg" alt="" />
        )}
      </Box>

      {open ? <PriceAlerts open={open} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

interface PriceAlertsIconProps {
  tokenId: string | Null;
}

export function PriceAlertsIcon({ tokenId }: PriceAlertsIconProps) {
  const principal = useAccountPrincipalString();
  const { data } = usePriceAlerts(principal);

  const hasAlerts = useMemo(() => {
    if (isUndefinedOrNull(tokenId) || isUndefinedOrNull(data)) return undefined;
    return !!data.find((element) => element.tokenId === tokenId);
  }, [data, tokenId]);

  return isUndefinedOrNull(hasAlerts) ? null : <PriceAlertsIcons hasAlerts={hasAlerts} />;
}
