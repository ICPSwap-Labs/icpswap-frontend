import { EstimatedBalance } from "components/Wallet/assets/EstimatedBalance";
import { Assets } from "components/Wallet/assets/Assets";
import { Box } from "components/Mui";

export function AssetsWrapper() {
  return (
    <>
      <Box sx={{ padding: "0 16px", margin: "24px 0 0 0" }}>
        <EstimatedBalance />
      </Box>
      <Box sx={{ margin: "30px 0 0 0" }}>
        <Assets />
      </Box>
    </>
  );
}
