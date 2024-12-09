import { useHistory } from "react-router-dom";
import { t, Trans } from "@lingui/macro";
import { Box, Avatar, makeStyles, useTheme } from "components/Mui";
import { useTokenInfo } from "hooks/token/index";
import { UserSwapPoolsBalance } from "hooks/info/tools";
import { useUserSwapPoolBalances, useParsedQueryString } from "@icpswap/hooks";
import { useMemo, useState } from "react";
import { Header, HeaderCell, TableRow, BodyCell, LoadingRow, NoData, BreadcrumbsV1, Flex } from "@icpswap/ui";
import { SelectToken, InfoWrapper } from "components/index";
import { parseTokenAmount, locationSearchReplace } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";
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

  const { result: token0 } = useTokenInfo(claim.token0.address);
  const { result: token1 } = useTokenInfo(claim.token1.address);

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
  const { principal } = useParsedQueryString() as {
    principal: string | undefined;
  };
  const [selectedTokenId, setSelectTokenId] = useState<string | undefined>(ICP.address);
  const { balances, loading } = useUserSwapPoolBalances(principal, selectedTokenId);

  const allClaims = useMemo(() => {
    return balances?.filter((ele) => ele.balance0 !== BigInt(0) || ele.balance1 !== BigInt(0));
  }, [balances]);

  const handleTokenChange = (tokenId: string) => {
    setSelectTokenId(tokenId);
  };

  const handleAddressChange = (address: string | Null) => {
    const search = locationSearchReplace(location.search, "principal", address);

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
              <SelectToken value={selectedTokenId} onTokenChange={handleTokenChange} search />
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
