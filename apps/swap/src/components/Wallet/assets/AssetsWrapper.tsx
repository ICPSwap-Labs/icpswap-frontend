import { EstimatedBalance } from "components/Wallet/assets/EstimatedBalance";
import { Assets } from "components/Wallet/assets/Assets";
import { Box } from "components/Mui";
import { BalanceConvertEntry } from "components/Wallet/BalanceConvert/index";

export function AssetsWrapper() {
  return (
    <>
      <Box sx={{ padding: "0 12px", margin: "24px 0 0 0" }}>
        <EstimatedBalance />
      </Box>

      <Box sx={{ margin: "12px 0 0 0", padding: "0 12px" }}>
        <BalanceConvertEntry />
      </Box>

      <Box sx={{ margin: "22px 0 0 0" }}>
        <Assets />
      </Box>
    </>
  );
}
