import { useHistory } from "react-router-dom";
import { Trans } from "@lingui/macro";
import { Box, Avatar, makeStyles, Typography, useTheme } from "components/Mui";
import { useTokenInfo } from "hooks/token/index";
import { UserSwapPoolsBalance } from "hooks/info/tools";
import { useUserSwapPoolBalances, useParsedQueryString } from "@icpswap/hooks";
import { useMemo, useState } from "react";
import { Header, HeaderCell, TableRow, BodyCell, LoadingRow, NoData, BreadcrumbsV1, Flex } from "@icpswap/ui";
import { SelectToken, InfoWrapper, FilledTextField } from "components/index";
import { parseTokenAmount, locationSearchReplace, isValidPrincipal } from "@icpswap/utils";
import { ICP } from "@icpswap/tokens";
import { ToolsWrapper } from "components/info/tools/Wrapper";

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

  const handleAddressChange = (address: string | undefined) => {
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
          <Flex gap="0 20px">
            <Box
              sx={{
                width: "343px",
                height: "40px",
                "@media(max-width: 640px)": {
                  width: "100%",
                },
              }}
            >
              <FilledTextField
                width="100%"
                fullHeight
                value={principal}
                textFiledProps={{
                  placeholder: `Search the principal for valuation`,
                }}
                placeholderSize="12px"
                onChange={handleAddressChange}
                background={theme.palette.background.level1}
              />

              {principal && !isValidPrincipal(principal) ? (
                <Typography sx={{ margin: "3px 0 0 2px", fontSize: "12px" }} color="error.main">
                  <Trans>Invalid principal</Trans>
                </Typography>
              ) : null}
            </Box>

            <Box sx={{ width: "240px" }}>
              <SelectToken value={selectedTokenId} onTokenChange={handleTokenChange} />
            </Box>
          </Flex>
        }
      >
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
      </ToolsWrapper>
    </InfoWrapper>
  );
}
