import { Box, useTheme } from "components/Mui";
import { PriceAlerts } from "components/PriceAlerts/PriceAlerts";
import { useState } from "react";

export function AddedPriceAlertsIcon() {
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
        <img src="/images/swap/price-alerts-added.svg" alt="" />
      </Box>

      {open ? <PriceAlerts open={open} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export function AddPriceAlertsIcon() {
  const theme = useTheme();

  return (
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
    >
      <img src="/images/swap/price-alerts-add.svg" alt="" />
    </Box>
  );
}
