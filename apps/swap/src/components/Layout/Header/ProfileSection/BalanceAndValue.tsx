import { useMemo } from "react";
import { Typography } from "components/Mui";
import { BigNumber, formatDollarAmountV1, nonNullArgs, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";
import { useHelperUserTokens } from "@icpswap/hooks";
import { Flex } from "@icpswap/ui";
import { useAccountPrincipal } from "store/auth/hooks";
import { useInfoToken } from "hooks/info/useInfoTokens";

export function BalanceAndValue() {
  const principal = useAccountPrincipal();

  const infoToken = useInfoToken(ICP.address);
  const { result: userTokens, loading } = useHelperUserTokens({ principal: principal?.toString() });

  const totalBalance = useMemo(() => {
    if (loading) return undefined;
    return userTokens?.totalBalance ?? 0;
  }, [userTokens, loading]);

  return (
    <Flex sx={{ padding: "20px 0 0 0" }} justify="center" vertical align="center">
      {/* <Typography sx={{ fontSize: "12px" }}>
                        <Trans>Est total value</Trans>
                      </Typography> */}

      <Typography sx={{ fontSize: "28px", fontWeight: 500, margin: "12px 0 0 0", color: "text.primary" }}>
        {nonNullArgs(totalBalance) ? formatDollarAmountV1({ num: totalBalance, ab: 0.01 }) : "--"}
      </Typography>

      <Typography sx={{ fontSize: "16px", margin: "8px 0 0 0" }}>
        {nonNullArgs(totalBalance) && infoToken
          ? toSignificantWithGroupSeparator(new BigNumber(totalBalance).dividedBy(infoToken.priceUSD).toString(), 4)
          : "--"}{" "}
        ICP
      </Typography>
    </Flex>
  );
}
