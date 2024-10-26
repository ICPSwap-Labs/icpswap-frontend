import { Trans } from "@lingui/macro";
import { Box, Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTokenInfo } from "hooks/token/index";
import { UserSwapPoolsBalance } from "hooks/useUserAllReclaims";
import { useUserSwapPoolBalances } from "@icpswap/hooks";
import { useMemo, useState } from "react";
import { Header, HeaderCell, TableRow, BodyCell } from "@icpswap/ui";
import { LoadingRow, NoData, SelectToken } from "ui-component/index";
import { parseTokenAmount } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";
import SwapScanWrapper, { ScanChildrenProps } from "./SwapScanWrapper";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      gridTemplateColumns: "1fr 2fr",

      "@media screen and (max-width: 780px)": {
        gridTemplateColumns: "1fr 1fr",
      },
    },
  };
});

interface ClaimItemProps {
  claim: UserSwapPoolsBalance;
}

function ClaimItem({ claim }: ClaimItemProps) {
  const classes = useStyles();

  const { result: token0 } = useTokenInfo(claim.token0.address);
  const { result: token1 } = useTokenInfo(claim.token1.address);

  return (
    <>
      {claim.balance0 !== BigInt(0) && !!token0 ? (
        <TableRow className={classes.wrapper}>
          <BodyCell>
            <Box sx={{ display: "flex", gap: "0 3px", alignItems: "center" }}>
              <Avatar src={token0.logo} sx={{ width: "24px", height: "24px", margin: "0 8px 0 0" }}>
                &nbsp;
              </Avatar>
              {parseTokenAmount(claim.balance0, token0.decimals).toFormat()}
            </Box>
          </BodyCell>
          <BodyCell>
            <Box>
              <BodyCell>{!!token0 && !!token1 ? `${token0.symbol}/${token1.symbol}` : "--"}</BodyCell>
              <BodyCell sub>{`${claim.canisterId.toString()}`}</BodyCell>
            </Box>
          </BodyCell>
        </TableRow>
      ) : null}

      {claim.balance1 !== BigInt(0) && !!token1 ? (
        <TableRow className={classes.wrapper}>
          <BodyCell>
            <Box sx={{ display: "flex", gap: "0 3px", alignItems: "center" }}>
              <Avatar src={token1.logo} sx={{ width: "24px", height: "24px", margin: "0 8px 0 0" }}>
                &nbsp;
              </Avatar>
              {parseTokenAmount(claim.balance1, token1.decimals).toFormat()}
            </Box>
          </BodyCell>

          <BodyCell>
            <Box>
              <BodyCell>{!!token0 && !!token1 ? `${token0.symbol}/${token1.symbol}` : "--"}</BodyCell>
              <BodyCell sub>{`${claim.canisterId.toString()}`}</BodyCell>
            </Box>
          </BodyCell>
        </TableRow>
      ) : null}
    </>
  );
}

interface ReclaimProps {
  address: string | undefined;
}

function Reclaim({ address }: ReclaimProps) {
  const classes = useStyles();
  const [selectedTokenId, setSelectTokenId] = useState<string | undefined>(ICP.address);
  const { balances, loading } = useUserSwapPoolBalances(address, selectedTokenId);

  const allClaims = useMemo(() => {
    return balances?.filter((ele) => ele.balance0 !== BigInt(0) || ele.balance1 !== BigInt(0));
  }, [balances]);

  const handleTokenChange = (tokenId: string) => {
    setSelectTokenId(tokenId);
  };

  return (
    <>
      <Box sx={{ margin: "10px 0" }}>
        <Box sx={{ width: "240px" }}>
          <SelectToken value={selectedTokenId} onTokenChange={handleTokenChange} />
        </Box>
      </Box>

      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ minWidth: "1200px" }}>
          <Header className={classes.wrapper}>
            <HeaderCell field="amountUSD">
              <Trans>Token Amount</Trans>
            </HeaderCell>

            <HeaderCell field="amountToken0">
              <Trans>Token Pair</Trans>
            </HeaderCell>
          </Header>

          {allClaims.map((ele) => (
            <ClaimItem key={`${ele.token0.address}_${ele.token1.address}_${ele.type}`} claim={ele} />
          ))}

          {allClaims.length === 0 && !loading ? <NoData /> : null}

          {loading ? (
            <Box sx={{ padding: "16px" }}>
              <LoadingRow>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
              </LoadingRow>
            </Box>
          ) : null}
        </Box>
      </Box>
    </>
  );
}

export default function SwapScanReclaim() {
  return <SwapScanWrapper>{({ address }: ScanChildrenProps) => <Reclaim address={address} />}</SwapScanWrapper>;
}
