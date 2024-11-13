import { Typography } from "components/Mui";
import { BigNumber, formatDollarAmountV1, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";
import { useHelperUserTokens } from "@icpswap/hooks";
import { Flex } from "@icpswap/ui";
import { useAccountPrincipal } from "store/auth/hooks";
import { useInfoToken } from "hooks/info/useInfoTokens";

export function BalanceAndValue() {
  const principal = useAccountPrincipal();

  const infoToken = useInfoToken(ICP.address);
  const { result: userTokens } = useHelperUserTokens({ principal: principal?.toString() });

  return (
    <Flex sx={{ padding: "20px 0 0 0" }} justify="center" vertical align="center">
      {/* <Typography sx={{ fontSize: "12px" }}>
                        <Trans>Est total value</Trans>
                      </Typography> */}

      <Typography sx={{ fontSize: "28px", fontWeight: 500, margin: "12px 0 0 0", color: "text.primary" }}>
        {userTokens ? formatDollarAmountV1({ num: userTokens.totalBalance }) : "--"}
      </Typography>

      <Typography sx={{ fontSize: "16px", margin: "8px 0 0 0" }}>
        {userTokens && infoToken
          ? toSignificantWithGroupSeparator(
              new BigNumber(userTokens.totalBalance).dividedBy(infoToken.priceUSD).toString(),
              4,
            )
          : "--"}{" "}
        ICP
      </Typography>
    </Flex>
  );
}
