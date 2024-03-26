import { useState, useMemo } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { t } from "@lingui/macro";
import { Override, PublicTokenOverview } from "@icpswap/types";
import { formatDollarAmount } from "@icpswap/utils";
import { NoData, StaticLoading, TokenImage } from "ui-component/index";
import Pagination from "ui-component/pagination/cus";
import { useTokenInfo } from "hooks/token/index";
import { Header, HeaderCell, BodyCell, TableRow, SortDirection } from "@icpswap/ui";
import PercentageChangeLabel from "ui-component/PercentageChange";
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

export function TokenItem({ token, index }: { token: TokenData; index: number }) {
  const classes = useStyles();
  const history = useHistory();
  const { result: tokenInfo } = useTokenInfo(token.address);

  const handleTokenClick = () => {
    history.push(`/swap/token/details/${token.address}`);
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
      <BodyCell color="text.primary" align="right">
        {formatDollarAmount(token.priceUSD, 3)}
      </BodyCell>
      <BodyCell align="right">
        <PercentageChangeLabel align="right" value={token.priceUSDChange} />
      </BodyCell>
      <BodyCell color="text.primary" align="right">
        {formatDollarAmount(token.volumeUSD)}
      </BodyCell>
      <BodyCell color="text.primary" align="right">
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

export default function TokenTable({ tokens: _tokens, maxItems = 10, loading }: TokenTableProps) {
  const classes = useStyles();
  const [page, setPage] = useState(1);

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

  return (
    <>
      <Header className={classes.wrapper} onSortChange={handleSortChange} defaultSortFiled={sortField}>
        {headers.map((header) => (
          <HeaderCell
            key={header.key}
            field={header.key}
            isSort={header.sort}
            align={header.key !== "#" && header.key !== "name" ? "right" : "left"}
          >
            {header.label}
          </HeaderCell>
        ))}
      </Header>

      {(sortedTokens ?? []).map((token, index) => (
        <TokenItem key={String(token.address)} index={(page - 1) * maxItems + index + 1} token={token} />
      ))}

      {tokens?.length === 0 && !loading ? (
        <NoData
          tip={t`If the token or trading pair you're searching for isn't in the Tokenlist, try adjusting the settings to display all tokens and trading pairs.`}
        />
      ) : null}

      {loading ? <StaticLoading loading={loading} /> : null}

      <Box mt="20px">
        {!loading && (tokens?.length ?? 0) > 0 ? (
          <Pagination maxItems={maxItems} length={tokens?.length ?? 0} onPageChange={setPage} page={page} />
        ) : null}
      </Box>
    </>
  );
}
