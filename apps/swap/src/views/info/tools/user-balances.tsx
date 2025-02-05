import { useHistory } from "react-router-dom";
import { t, Trans } from "@lingui/macro";
import { Box, Avatar, makeStyles, useTheme } from "components/Mui";
import { useToken } from "hooks/index";
import { UserSwapPoolsBalance } from "hooks/info/tools";
import { useUserSwapPoolBalances, useParsedQueryString } from "@icpswap/hooks";
import { useMemo } from "react";
import { Header, HeaderCell, TableRow, BodyCell, LoadingRow, NoData, BreadcrumbsV1, Flex } from "@icpswap/ui";
import { SelectToken, InfoWrapper, SelectPair } from "components/index";
import { parseTokenAmount, locationSearchReplace } from "@icpswap/utils";
import { ToolsWrapper, PrincipalSearcher } from "components/info/tools";
import { Null } from "@icpswap/types";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      gridTemplateColumns: "1fr 2fr",
      padding: "24px",
      "@media screen and (max-width: 780px)": {
        gridTemplateColumns: "1fr 1fr",
        padding: "16px",
      },
    },
  };
});

interface ClaimItemProps {
  claim: UserSwapPoolsBalance;
}

function ClaimItem({ claim }: ClaimItemProps) {
  const classes = useStyles();
  const theme = useTheme();

  const [, token0] = useToken(claim.token0.address);
  const [, token1] = useToken(claim.token1.address);

  return (
    <>
      {claim.balance0 !== BigInt(0) && !!token0 ? (
        <TableRow className={classes.wrapper} borderBottom={`1px solid ${theme.palette.border.level1}`}>
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
        <TableRow className={classes.wrapper} borderBottom={`1px solid ${theme.palette.border.level1}`}>
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

export default function UserPoolBalance() {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const { principal, tokenId, pair } = useParsedQueryString() as {
    principal: string | undefined;
    tokenId: string | undefined;
    pair: string | undefined;
  };

  const { balances, loading } = useUserSwapPoolBalances({ principal, tokenId, poolId: pair });

  const allClaims = useMemo(() => {
    return balances?.filter((ele) => ele.balance0 !== BigInt(0) || ele.balance1 !== BigInt(0));
  }, [balances]);

  const handleTokenChange = (tokenId: string) => {
    const search = locationSearchReplace(location.search, "tokenId", tokenId);
    history.push(`/info-tools/user-balances${search}`);
  };

  const handleAddressChange = (address: string | Null) => {
    const search = locationSearchReplace(location.search, "principal", address);
    history.push(`/info-tools/user-balances${search}`);
  };

  const handlePairChange = (pair: string | Null) => {
    const search = locationSearchReplace(location.search, "pair", pair);
    history.push(`/info-tools/user-balances${search}`);
  };

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1
        links={[{ label: <Trans>Tools</Trans>, link: "/info-tools" }, { label: <Trans>User's Pool Balance</Trans> }]}
      />

      <Box sx={{ height: "20px", width: "100%" }} />

      <ToolsWrapper
        title={<Trans>User's Pool Balance</Trans>}
        action={
          <Flex
            gap="16px"
            sx={{
              "@media(max-width: 640px)": {
                flexDirection: "column",
                alignItems: "flex-start",
              },
            }}
          >
            <PrincipalSearcher
              placeholder={t`Search the principal for user's pool balance`}
              onPrincipalChange={handleAddressChange}
            />

            <Box sx={{ width: "240px" }}>
              <SelectToken value={tokenId} onTokenChange={handleTokenChange} search />
            </Box>

            <Box sx={{ width: "240px" }}>
              <SelectPair value={pair} onPairChange={handlePairChange} search />
            </Box>
          </Flex>
        }
      >
        <Box sx={{ width: "100%", overflow: "auto" }}>
          <Box sx={{ minWidth: "1200px" }}>
            <Header className={classes.wrapper} borderBottom={`1px solid ${theme.palette.border.level1}`}>
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
      </ToolsWrapper>
    </InfoWrapper>
  );
}
