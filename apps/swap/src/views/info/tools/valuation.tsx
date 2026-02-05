import { useNavigate, useLocation } from "react-router-dom";
import { InfoWrapper, FilledTextField, TokenImage } from "components/index";
import { makeStyles, Box, Typography, Link, useTheme } from "components/Mui";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  isValidPrincipal,
  toSignificant,
  parseTokenAmount,
  BigNumber,
  explorerLink,
  locationSearchReplace,
} from "@icpswap/utils";
import { useTokensBalance, useTokensFromList, useParsedQueryString, TokenBalanceState } from "@icpswap/hooks";
import {
  MainCard,
  Header,
  HeaderCell,
  TableRow,
  BodyCell,
  LoadingRow,
  OnlyTokenList,
  NoData,
  BreadcrumbsV1,
} from "@icpswap/ui";
import { ICP } from "@icpswap/tokens";
import { getAllTokens } from "store/allTokens";
import { useTokensInfo } from "hooks/token";
import { TokenInfo } from "types/token";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      gap: "1em",
      alignItems: "center",
      gridTemplateColumns: "1fr repeat(3, 1fr)",
      "@media screen and (max-width: 780px)": {
        gridTemplateColumns: "1fr repeat(3, 1fr)",
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
  const theme = useTheme();
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
      borderBottom={`1px solid ${theme.palette.border.level1}`}
    >
      <BodyCell>
        <Box sx={{ display: "flex", gap: "0 10px", alignItems: "center" }}>
          <TokenImage size="28px" logo={tokenInfo.logo} tokenId={tokenInfo.canisterId} />

          <BodyCell color="text.primary">
            {balance
              ? toSignificant(parseTokenAmount(balance, tokenInfo.decimals).toString(), 8, { groupSeparator: "," })
              : "--"}
          </BodyCell>

          <BodyCell>{tokenInfo.symbol}</BodyCell>
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
        <Link href={explorerLink(tokenInfo.canisterId)} target="_blank">
          {tokenInfo.canisterId}
        </Link>
      </BodyCell>
    </TableRow>
  );
}

export default function SwapScanValuation() {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const { principal } = useParsedQueryString() as { principal: string };
  const navigate = useNavigate();
  const location = useLocation();

  const [checked, setChecked] = useState(false);
  const [allTokenIds, setAllTokenIds] = useState<string[]>([]);
  const [usdValues, setUSDValues] = useState<{ [tokenId: string]: string }>({});
  const [userTokenBalances, setUserTokensBalance] = useState(
    {} as { [tokenId: string]: { balance: bigint | undefined; tokenInfo: TokenInfo } },
  );

  useEffect(() => {
    async function call() {
      const allTokenIds = await getAllTokens();
      setAllTokenIds(allTokenIds ?? []);
    }
    call();
  }, []);

  const address = useMemo(() => {
    if (!principal) return undefined;
    if (!isValidPrincipal(principal)) return undefined;
    setUserTokensBalance({});
    setUSDValues({});
    return principal;
  }, [principal]);

  const __allTokensInfo = useTokensInfo(allTokenIds);
  const allTokensInfo = useMemo(() => {
    return __allTokensInfo.reduce((prev, curr) => {
      const tokenInfo = curr[1];

      if (tokenInfo) {
        return prev.concat([tokenInfo]);
      }

      return prev;
    }, [] as TokenInfo[]);
  }, [__allTokensInfo]);

  const allTokensBalance = useTokensBalance({ tokenIds: allTokenIds, address });

  const loading = useMemo(() => {
    return !!allTokensBalance.find((e) => e.state === TokenBalanceState.LOADING);
  }, [allTokensBalance, allTokenIds]);

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
    if (!principal) return new BigNumber(0);
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
  }, [usdValues, checked, tokenList, principal]);

  const sortedUserTokenBalances = useMemo(() => {
    const values = Object.values(userTokenBalances).filter((e) => e.balance !== undefined) as {
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

  const handleSearchChange = useCallback(
    (value: string) => {
      if (isValidPrincipal(value) || value === "") {
        const search = locationSearchReplace(location.search, "principal", value);
        navigate(`${location.pathname}${search}`);
      }
    },
    [navigate, location],
  );

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1
        links={[{ label: t("common.tools"), link: "/info-tools" }, { label: t("tools.wallet.valuation") }]}
      />

      <MainCard sx={{ margin: "20px 0 0 0" }}>
        <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>{t("tools.wallet.valuation")}</Typography>

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
              textFieldProps={{
                slotProps: {
                  input: {
                    placeholder: `Search the principal for valuation`,
                  },
                },
              }}
              onChange={handleSearchChange}
              placeholderSize="14px"
              background={theme.palette.background.level1}
            />

            {principal && !isValidPrincipal(principal) ? (
              <Typography sx={{ margin: "3px 0 0 2px", fontSize: "12px" }} color="error.main">
                {t("common.invalid.principal.id")}
              </Typography>
            ) : null}
          </Box>
        </Box>

        <Box sx={{ margin: "20px 0 0 0" }}>
          <Box sx={{ display: "flex", gap: "0 5px" }}>
            <Typography color="text.primary" fontSize="16px" fontWeight={500}>
              {t("common.total.values.colon")}
            </Typography>
            <Typography color="text.primary" fontSize="18px" fontWeight={500}>
              ${toSignificant(totalUSDValues.toString(), 6, { groupSeparator: "," })}
            </Typography>
          </Box>
          <Typography sx={{ margin: "12px 0" }}>{t("tools.wallet.valuation.descriptions")}</Typography>
          <Box>
            <OnlyTokenList onChange={handleCheckChange} checked={checked} />
          </Box>
        </Box>

        <Box sx={{ width: "100%", overflow: "auto hidden" }}>
          <Box sx={{ minWidth: "840px" }}>
            <Header
              className={classes.wrapper}
              borderBottom={`1px solid ${theme.palette.border.level1}`}
              sx={{ display: "grid" }}
            >
              <HeaderCell>{t("common.token")}</HeaderCell>

              <HeaderCell field="usdValue">{t("common.value")}</HeaderCell>

              <HeaderCell field="price">{t("common.price")}</HeaderCell>

              <HeaderCell field="amountToken1">{t("common.canister.id")}</HeaderCell>
            </Header>

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
                </LoadingRow>
              </Box>
            ) : !address || sortedUserTokenBalances.filter((e) => e.balance !== BigInt(0)).length === 0 ? (
              <NoData tip={t("info.tools.user.wallet.value.empty")} />
            ) : (
              sortedUserTokenBalances
                .filter((e) => e.balance !== BigInt(0))
                .map((e) => (
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
          </Box>
        </Box>
      </MainCard>
    </InfoWrapper>
  );
}
