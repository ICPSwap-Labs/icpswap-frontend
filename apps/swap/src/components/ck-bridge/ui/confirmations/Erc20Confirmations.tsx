import { Flex } from "@icpswap/ui";
import { Typography } from "components/Mui";
import { useErc20DissolveDetails } from "store/web3/hooks";
import { erc20DissolveStatus } from "utils/web3/dissolve";

interface Erc20DissolveConfirmationsProps {
  withdraw_id: string;
}

export function Erc20DissolveConfirmations({ withdraw_id }: Erc20DissolveConfirmationsProps) {
  const erc20DissolveDetails = useErc20DissolveDetails(withdraw_id);

  return (
    <Flex sx={{ gap: "0 4px" }}>
      <Typography sx={{ fontSize: "12px" }}>
        {erc20DissolveDetails?.status ? erc20DissolveStatus(erc20DissolveDetails?.status) : "--"}
      </Typography>
    </Flex>
  );
}
