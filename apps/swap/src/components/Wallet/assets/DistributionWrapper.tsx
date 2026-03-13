import { DistributionEstimatedBalance } from "components/Wallet/assets/DistributionEstimatedBalance";
import { Distribution } from "components/Wallet/assets/Distribution";
import { Box } from "components/Mui";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useAddressOverview } from "@icpswap/hooks";

export function DistributionWrapper() {
  const principal = useAccountPrincipalString();

  const { data: addressOverview, refetch } = useAddressOverview(principal);

  return (
    <>
      <Box sx={{ padding: "0 16px", margin: "24px 0 0 0" }}>
        <DistributionEstimatedBalance addressOverview={addressOverview} onRefresh={refetch} />
      </Box>

      <Box sx={{ margin: "30px 0 0 0" }}>
        <Distribution addressOverview={addressOverview} />
      </Box>
    </>
  );
}
