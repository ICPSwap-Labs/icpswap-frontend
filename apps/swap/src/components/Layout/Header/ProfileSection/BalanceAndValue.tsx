import { Typography } from "components/Mui";
import { formatDollarAmount, formatIcpAmount, parseTokenAmount } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";
import { Flex } from "@icpswap/ui";
import { useAccountPrincipal } from "store/auth/hooks";
import { useInfoToken } from "@icpswap/hooks";
import { useTokenBalance } from "hooks/token/useTokenBalance";

export function BalanceAndValue() {
  const principal = useAccountPrincipal();

  const infoToken = useInfoToken(ICP.address);
  const { result: tokenBalance } = useTokenBalance(ICP.address, principal);

  return (
    <Flex sx={{ padding: "20px 0 0 0" }} justify="center" vertical align="center">
      <Typography sx={{ fontSize: "28px", fontWeight: 500, margin: "12px 0 0 0", color: "text.primary" }}>
        {tokenBalance && infoToken
          ? formatDollarAmount(parseTokenAmount(tokenBalance, ICP.decimals).multipliedBy(infoToken.price).toString())
          : "--"}
      </Typography>

      <Typography sx={{ fontSize: "16px", margin: "8px 0 0 0" }}>
        {tokenBalance ? formatIcpAmount(parseTokenAmount(tokenBalance, ICP.decimals).toString()) : "--"} ICP
      </Typography>
    </Flex>
  );
}
