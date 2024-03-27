import { MainCard, Wrapper, FilledTextField, NoData, TokenImage } from "ui-component/index";
import { useState, useMemo, useEffect } from "react";
import { Box, Typography, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Trans } from "@lingui/macro";
import { isValidPrincipal, toSignificant, parseTokenAmount, BigNumber } from "@icpswap/utils";
import { Header, HeaderCell, TableRow, BodyCell, GridAutoRows } from "@icpswap/ui";
import InTokenListCheck from "ui-component/InTokenListCheck";
import { getAllTokens } from "store/allTokens";
import { useTokensInfo } from "hooks/token";
import { TokenInfo } from "types/token";
import { useTokensBalance, useTokensFromList, useParsedQueryString } from "@icpswap/hooks";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { ICP } from "@icpswap/tokens";
import { getExplorerPrincipalLink } from "utils/index";
import { SwapScanTabPanels } from "./components/TabPanels";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      gap: "1em",
      alignItems: "center",
      gridTemplateColumns: "1.5fr repeat(3, 1fr)",
      "@media screen and (max-width: 780px)": {
        gridTemplateColumns: "1.5fr repeat(3, 1fr)",
      },
    },
  };
});

interface UserTokenBalanceProps {
  balance: bigint | undefined;
  tokenInfo: TokenInfo;
  tokenList: string[] | undefined;
  displayTokenInList: boolean;
  onUpdateUSDValues: (tokenId: string, usd: string) => void;
}

function UserTokenBalance({
  balance,
  tokenInfo,
  tokenList,
  displayTokenInList,
  onUpdateUSDValues,
}: UserTokenBalanceProps) {
  const classes = useStyles();
  const tokenUSDPrice = useUSDPriceById(tokenInfo.canisterId);

  useEffect(() => {
    if (tokenUSDPrice && balance) {
      onUpdateUSDValues(
        tokenInfo.canisterId,
        new BigNumber(tokenUSDPrice).multipliedBy(parseTokenAmount(balance, tokenInfo.decimals)).toString(),
      );
    }
  }, [tokenInfo, tokenUSDPrice, balance]);

  return (
    <TableRow
      className={classes.wrapper}
      sx={{ display: displayTokenInList && !!tokenList && !tokenList.includes(tokenInfo.canisterId) ? "none" : "grid" }}
    >
      <BodyCell>
        <Box sx={{ display: "flex", gap: "0 10px", alignItems: "center" }}>
          <TokenImage logo={tokenInfo.logo} tokenId={tokenInfo.canisterId} />

          <Typography color="text.primary">{tokenInfo.symbol}</Typography>

          <Typography color="text.primary">
            {balance
              ? toSignificant(parseTokenAmount(balance, tokenInfo.decimals).toString(), 8, { groupSeparator: "," })
              : "--"}
          </Typography>
        </Box>
      </BodyCell>

      <BodyCell>
        {tokenUSDPrice && balance
          ? `$${toSignificant(
              new BigNumber(tokenUSDPrice).multipliedBy(parseTokenAmount(balance, tokenInfo.decimals)).toString(),
              6,
              { groupSeparator: "," },
            )}`
          : "--"}
      </BodyCell>

      <BodyCell>{tokenUSDPrice ? `$${toSignificant(tokenUSDPrice, 6, { groupSeparator: "," })}` : "--"}</BodyCell>

      <BodyCell>
        <Link
          href={getExplorerPrincipalLink(tokenInfo.canisterId)}
          target="_blank"
          sx={{ "@media screen and (max-width: 640px)": { fontSize: "12px" } }}
        >
          {tokenInfo.canisterId}
        </Link>
      </BodyCell>
    </TableRow>
  );
}

export default function SwapScanValuation() {
  const classes = useStyles();

  const [allTokenIds, setAllTokenIds] = useState<string[]>([]);
  const [search, setSearch] = useState<null | string>(null);
  const [usdValues, setUSDValues] = useState<{ [tokenId: string]: string }>({});
  const [userTokenBalances, setUserTokensBalance] = useState(
    {} as { [tokenId: string]: { balance: bigint | undefined; tokenInfo: TokenInfo } },
  );

  const { principal } = useParsedQueryString() as { principal: string };

  useEffect(() => {
    if (principal && isValidPrincipal(principal)) {
      setSearch(principal);
    }
  }, [principal]);

  useEffect(() => {
    async function call() {
      const allTokenIds = await getAllTokens();
      setAllTokenIds(allTokenIds ?? []);
    }
    call();
  }, []);

  const address = useMemo(() => {
    if (!search) return undefined;
    if (!isValidPrincipal(search)) return undefined;
    setUserTokensBalance({});
    setUSDValues({});
    return search;
  }, [search]);

  const _allTokensInfo = useTokensInfo(allTokenIds);
  const allTokensInfo = useMemo(() => {
    return _allTokensInfo.reduce((prev, curr) => {
      const tokenInfo = curr[1];

      if (tokenInfo) {
        return prev.concat([tokenInfo]);
      }

      return prev;
    }, [] as TokenInfo[]);
  }, [_allTokensInfo]);

  const allTokensBalance = useTokensBalance({ tokenIds: allTokenIds, address });

  useEffect(() => {
    if (!allTokensInfo || !allTokensBalance) return;

    allTokensInfo.forEach((e) => {
      const balance_index = allTokenIds.indexOf(e.canisterId);
      const balanceResult = allTokensBalance[balance_index] ? allTokensBalance[balance_index] : undefined;
      const balance = balanceResult?.balance;

      if (balance) {
        setUserTokensBalance((prevState) => ({
          ...prevState,
          [e.canisterId]: { tokenInfo: e, balance },
        }));
      }
    });
  }, [address, allTokensBalance, allTokensInfo]);

  const [checked, setChecked] = useState(false);

  const handleCheckChange = (checked: boolean) => {
    setChecked(checked);
  };

  const { result: allTokensInList } = useTokensFromList();
  const tokenList = useMemo(() => {
    const tokenIds = allTokensInList?.map((e) => e.canisterId) ?? [];
    tokenIds.push(ICP.address);
    return tokenIds;
  }, [allTokensInList]);

  const handleUpdateUSDValues = (tokenId: string, usd: string) => {
    setUSDValues((prevState) => ({ ...prevState, [tokenId]: usd }));
  };

  const totalUSDValues = useMemo(() => {
    if (!search) return new BigNumber(0);
    return Object.keys(usdValues).reduce((prev, curr) => {
      const usdValue = usdValues[curr];
      const inTokenList = !!tokenList.find((e) => e === curr);

      if (checked) {
        if (inTokenList) {
          return prev.plus(usdValue);
        }
        return prev.plus(0);
      }

      return prev.plus(usdValue);
    }, new BigNumber(0));
  }, [usdValues, checked, tokenList, search]);

  const sortedUserTokenBalances = useMemo(() => {
    const values = Object.values(userTokenBalances).filter((e) => !!e.balance) as {
      balance: bigint;
      tokenInfo: TokenInfo;
    }[];

    return values.sort((a, b) => {
      const usdValueA = usdValues[a.tokenInfo.canisterId];
      const usdValueB = usdValues[b.tokenInfo.canisterId];

      if (usdValueA && usdValueB) return new BigNumber(usdValueA).isGreaterThan(usdValueB) ? -1 : 1;
      if (!usdValueA) return 1;
      return -1;
    });
  }, [userTokenBalances, usdValues]);

  return (
    <Wrapper>
      <MainCard>
        <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
          <Trans>Swap Scan</Trans>
        </Typography>

        <Box
          sx={{
            display: "flex",
            margin: "30px 0 0 0",
            alignItems: "center",
            justifyContent: "space-between",
            "@media(max-width: 640px)": {
              margin: "20px 0 0 0",
              flexDirection: "column",
              gap: "20px 0",
              alignItems: "flex-start",
              justifyContent: "center",
            },
          }}
        >
          <SwapScanTabPanels />

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
              value={search}
              textFiledProps={{
                placeholder: `Search the principal for valuation`,
              }}
              onChange={(value: string) => setSearch(value)}
            />

            {search && !isValidPrincipal(search) ? (
              <Typography sx={{ margin: "3px 0 0 2px", fontSize: "12px" }} color="error.main">
                <Trans>Invalid principal</Trans>
              </Typography>
            ) : null}
          </Box>
        </Box>

        <Box sx={{ margin: "20px 0 0 0" }}>
          <Box sx={{ display: "flex", gap: "0 5px" }}>
            <Typography color="text.primary" fontSize="16px" fontWeight={500}>
              <Trans>Total Value:</Trans>
            </Typography>
            <Typography color="text.primary" fontSize="18px" fontWeight={500}>
              ${toSignificant(totalUSDValues.toString(), 6, { groupSeparator: "," })}
            </Typography>
          </Box>
          <Typography sx={{ margin: "12px 0" }}>
            <Trans>
              Searching for all valuable tokens in this wallet may take some time; please be patient. Note that some
              tokens might have poor liquidity and may not be tradable.
            </Trans>
          </Typography>
          <Box>
            <InTokenListCheck onChange={handleCheckChange} checked={checked} />
          </Box>
        </Box>

        <GridAutoRows gap="20px">
          <Header className={classes.wrapper} sx={{ display: "grid" }}>
            <HeaderCell>Token</HeaderCell>

            <HeaderCell field="usdValue">
              <Trans>Value</Trans>
            </HeaderCell>

            <HeaderCell field="price">
              <Trans>Price</Trans>
            </HeaderCell>

            <HeaderCell field="amountToken1">
              <Trans>Canister ID</Trans>
            </HeaderCell>
          </Header>

          {!address || sortedUserTokenBalances.length === 0 ? (
            <NoData />
          ) : (
            sortedUserTokenBalances.map((e) => (
              <UserTokenBalance
                key={e.tokenInfo.canisterId}
                tokenInfo={e.tokenInfo}
                balance={e.balance}
                displayTokenInList={checked}
                tokenList={tokenList}
                onUpdateUSDValues={handleUpdateUSDValues}
              />
            ))
          )}
        </GridAutoRows>
      </MainCard>
    </Wrapper>
  );
}
