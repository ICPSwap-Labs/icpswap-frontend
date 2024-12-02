import { useState, useMemo } from "react";
import { Box, Grid, useMediaQuery, makeStyles, useTheme } from "components/Mui";
import { useHistory } from "react-router-dom";
import { t } from "@lingui/macro";
import { Override, PublicTokenOverview } from "@icpswap/types";
import { formatDollarAmount, formatDollarTokenPrice } from "@icpswap/utils";
import { TokenImage } from "components/index";
import Pagination from "components/pagination/cus";
import { useTokenInfo } from "hooks/token/index";
import { Header, HeaderCell, BodyCell, TableRow, SortDirection, Proportion, NoData, ImageLoading } from "@icpswap/ui";
import { useAllTokensTVL } from "@icpswap/hooks";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridGap: "1em",
      alignItems: "center",
      gridTemplateColumns: "20px 2fr repeat(4, 1fr)",

      "@media screen and (max-width: 500px)": {
        gridTemplateColumns: "20px 1fr repeat(4, 1fr)",
      },
    },
  };
});

export type HeaderType = {
  label: string;
  key: string;
  sort: boolean;
  end?: boolean;
};

export function TokenItem({ token, index, align }: { token: TokenData; index: number; align: "left" | "right" }) {
  const classes = useStyles();
  const history = useHistory();
  const { result: tokenInfo } = useTokenInfo(token.address);

  const handleTokenClick = () => {
    history.push(`/info-swap/token/details/${token.address}`);
  };

  return (
    <TableRow className={classes.wrapper} onClick={handleTokenClick}>
      <BodyCell>{index}</BodyCell>
      <BodyCell>
        <Grid container alignItems="center" gap="0 8px">
          <TokenImage logo={tokenInfo?.logo} tokenId={tokenInfo?.canisterId} size="24px" />
          <BodyCell>{token.symbol}</BodyCell>
          {tokenInfo ? <BodyCell sub>({tokenInfo.name})</BodyCell> : null}
        </Grid>
      </BodyCell>
      <BodyCell color="text.primary" align={align}>
        {formatDollarTokenPrice({ num: token.priceUSD })}
      </BodyCell>
      <BodyCell align={align}>
        <Proportion align={align} value={token.priceUSDChange} />
      </BodyCell>
      <BodyCell color="text.primary" align={align}>
        {formatDollarAmount(token.volumeUSD)}
      </BodyCell>
      <BodyCell color="text.primary" align={align}>
        {formatDollarAmount(token.tvlUSD)}
      </BodyCell>
    </TableRow>
  );
}

type TokenData = Override<PublicTokenOverview, { tvlUSD: number }>;

export interface TokenTableProps {
  tokens: PublicTokenOverview[] | undefined | null;
  maxItems?: number;
  loading?: boolean;
}

const headers: HeaderType[] = [
  { label: "#", key: "#", sort: false },
  { label: t`Name`, key: "name", sort: true },
  { label: t`Price`, key: "priceUSD", sort: true },
  { label: t`Price Change`, key: "priceUSDChange", sort: true },
  { label: t`Volume 24H`, key: "volumeUSD", sort: true },
  { label: t`TVL`, key: "tvlUSD", sort: true },
];

export function TokenTable({ tokens: _tokens, maxItems = 10, loading }: TokenTableProps) {
  const classes = useStyles();
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const [sortField, setSortField] = useState<string>("volumeUSD");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const { result: allTokensTVL } = useAllTokensTVL();

  const tokens = useMemo(() => {
    if (!_tokens || !allTokensTVL) return [];

    setPage(1);

    return _tokens
      .slice()
      .filter((token) => {
        return token.priceUSD !== Infinity;
      })
      .map((token) => {
        const tvlUSD = allTokensTVL.find((tokenTvl) => tokenTvl[0] === token.address);

        return { ...token, tvlUSD: tvlUSD ? tvlUSD[1] : 0 };
      }) as TokenData[];
  }, [_tokens, allTokensTVL]);

  const sortedTokens = useMemo(() => {
    return tokens
      ? tokens
          .slice()
          .sort((a, b) => {
            if (a && b && !!sortField) {
              const bool =
                a[sortField as keyof PublicTokenOverview] > b[sortField as keyof PublicTokenOverview]
                  ? (sortDirection === SortDirection.ASC ? 1 : -1) * 1
                  : (sortDirection === SortDirection.ASC ? 1 : -1) * -1;

              return bool;
            }
            return 0;
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : [];
  }, [tokens, maxItems, page, sortField, sortDirection]);

  const handleSortChange = (sortField: string, sortDirection: SortDirection) => {
    setSortDirection(sortDirection);
    setSortField(sortField);
  };

  const align = useMemo(() => {
    if (matchDownMD) return "left";
    return "right";
  }, [matchDownMD]);

  return (
    <>
      <Header className={classes.wrapper} onSortChange={handleSortChange} defaultSortFiled={sortField}>
        {headers.map((header) => (
          <HeaderCell
            key={header.key}
            field={header.key}
            isSort={header.sort}
            align={header.key !== "#" && header.key !== "name" ? align : "left"}
          >
            {header.label}
          </HeaderCell>
        ))}
      </Header>

      {(sortedTokens ?? []).map((token, index) => (
        <TokenItem key={String(token.address)} index={(page - 1) * maxItems + index + 1} token={token} align={align} />
      ))}

      {tokens?.length === 0 && !loading ? (
        <NoData
          tip={t`If the token or trading pair you're searching for isn't in the Tokenlist, try adjusting the settings to display all tokens and trading pairs.`}
        />
      ) : null}

      {loading ? <ImageLoading loading={loading} /> : null}

      <Box mt="20px">
        {!loading && (tokens?.length ?? 0) > 0 ? (
          <Pagination maxItems={maxItems} length={tokens?.length ?? 0} onPageChange={setPage} page={page} />
        ) : null}
      </Box>
    </>
  );
}
