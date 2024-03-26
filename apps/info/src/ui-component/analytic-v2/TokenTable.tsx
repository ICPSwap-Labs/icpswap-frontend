import { useState, useMemo } from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Box, Grid, Avatar } from "@mui/material";
import { useHistory } from "react-router-dom";
import { t } from "@lingui/macro";
import { formatDollarAmount } from "@icpswap/utils";
import { NoData, StaticLoading } from "ui-component/index";
import Pagination from "ui-component/pagination/cus";
import { useTokenInfo } from "hooks/token/index";
import { Token } from "types/analytic-v2";
import { Header, HeaderCell, BodyCell, TableRow, SortDirection, Proportion } from "@icpswap/ui";

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

export function TokenItem({ token, index }: { token: Token; index: number }) {
  const classes = useStyles();
  const history = useHistory();
  const { result: tokenInfo } = useTokenInfo(token.address);

  const handleTokenClick = () => {
    history.push(`/swap/v2/token/details/${token.address}`);
  };

  return (
    <TableRow className={classes.wrapper} onClick={handleTokenClick}>
      <BodyCell>{index}</BodyCell>
      <BodyCell>
        <Grid container alignItems="center">
          <Avatar src={tokenInfo?.logo} sx={{ width: "20px", height: "20px" }}>
            &nbsp;
          </Avatar>

          <Typography
            color="text.primary"
            fontWeight={500}
            sx={{
              marginLeft: "10px",
            }}
          >
            {token.name}
          </Typography>

          <Typography
            sx={{
              marginLeft: "8px",
              fontSize: "12px",
            }}
          >
            ({token.symbol})
          </Typography>
        </Grid>
      </BodyCell>
      <BodyCell>{formatDollarAmount(token.priceUSD, 3)}</BodyCell>
      <BodyCell>
        <Proportion value={token.priceUSDChange} />
      </BodyCell>
      <BodyCell>{formatDollarAmount(token.volumeUSD)}</BodyCell>
      <BodyCell>{formatDollarAmount(token.tvlUSD)}</BodyCell>
    </TableRow>
  );
}

export interface TokenTableProps {
  tokens: Token[] | undefined | null;
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

  const [sortField, setSortField] = useState<string>("tvlUSD");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const tokens = useMemo(() => {
    return _tokens
      ? _tokens.slice().filter((token) => {
          return token.priceUSD !== Infinity && token.tvlUSD !== Infinity;
        })
      : [];
  }, [_tokens]);

  const sortedTokens = useMemo(() => {
    return tokens
      ? tokens
          .slice()
          .sort((a, b) => {
            if (a && b && !!sortField) {
              const bool =
                a[sortField as keyof Token] > b[sortField as keyof Token]
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
      <Header className={classes.wrapper} onSortChange={handleSortChange} defaultSortFiled="tvlUSD">
        {headers.map((header) => (
          <HeaderCell key={header.key} field={header.key} isSort={header.sort}>
            {header.label}
          </HeaderCell>
        ))}
      </Header>

      {(sortedTokens ?? []).map((token, index) => (
        <TokenItem key={String(token.address)} index={(page - 1) * maxItems + index + 1} token={token} />
      ))}

      {tokens?.length === 0 && !loading ? <NoData /> : null}

      {loading ? <StaticLoading loading={loading} /> : null}

      <Box mt="20px">
        {!loading && (tokens?.length ?? 0) > 0 ? (
          <Pagination maxItems={maxItems} length={tokens?.length ?? 0} onPageChange={setPage} />
        ) : null}
      </Box>
    </>
  );
}
