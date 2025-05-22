import { useState, useMemo } from "react";
import { Box, useMediaQuery, makeStyles, useTheme } from "components/Mui";
import { useHistory } from "react-router-dom";
import { Override, PublicTokenOverview } from "@icpswap/types";
import { formatDollarAmount, formatDollarTokenPrice } from "@icpswap/utils";
import { TokenImage } from "components/index";
import Pagination from "components/pagination/cus";
import { useToken } from "hooks/index";
import {
  Header,
  HeaderCell,
  BodyCell,
  TableRow,
  SortDirection,
  Proportion,
  NoData,
  ImageLoading,
  Flex,
} from "@icpswap/ui";
import { useAllTokensTVL } from "@icpswap/hooks";
import i18n from "i18n/index";
import { useTranslation } from "react-i18next";

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

export function TokenItem({
  token: infoToken,
  index,
  align,
}: {
  token: TokenData;
  index: number;
  align: "left" | "right";
}) {
  const classes = useStyles();
  const history = useHistory();
  const [, token] = useToken(infoToken.address);

  const handleTokenClick = () => {
    history.push(`/info-swap/token/details/${infoToken.address}`);
  };

  return (
    <TableRow className={classes.wrapper} onClick={handleTokenClick}>
      <BodyCell>{index}</BodyCell>
      <BodyCell>
        <Flex fullWidth gap="0 8px" sx={{ maxWidth: "352px" }}>
          <TokenImage logo={token?.logo} tokenId={token?.address} size="24px" />
          <BodyCell
            sx={{
              display: "block",
              maxWidth: "160px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {infoToken.symbol}
          </BodyCell>
          {token ? (
            <BodyCell
              sx={{
                display: "block",
                maxWidth: "160px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              sub
            >
              ({token.name})
            </BodyCell>
          ) : null}
        </Flex>
      </BodyCell>
      <BodyCell color="text.primary" align={align}>
        {formatDollarTokenPrice(infoToken.priceUSD)}
      </BodyCell>
      <BodyCell align={align}>
        <Proportion align={align} value={infoToken.priceUSDChange} />
      </BodyCell>
      <BodyCell color="text.primary" align={align}>
        {formatDollarAmount(infoToken.volumeUSD)}
      </BodyCell>
      <BodyCell color="text.primary" align={align}>
        {formatDollarAmount(infoToken.tvlUSD)}
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
  { label: i18n.t("common.name"), key: "name", sort: true },
  { label: i18n.t("common.price"), key: "priceUSD", sort: true },
  { label: i18n.t("common.price.range"), key: "priceUSDChange", sort: true },
  { label: i18n.t("common.volume24h"), key: "volumeUSD", sort: true },
  { label: i18n.t("common.tvl"), key: "tvlUSD", sort: true },
];

export function TokenTable({ tokens: _tokens, maxItems = 10, loading }: TokenTableProps) {
  const { t } = useTranslation();
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

      {tokens?.length === 0 && !loading ? <NoData tip={t("info.swap.pool.empty")} /> : null}

      {loading ? <ImageLoading loading={loading} /> : null}

      <Box mt="20px">
        {!loading && (tokens?.length ?? 0) > 0 ? (
          <Pagination maxItems={maxItems} length={tokens?.length ?? 0} onPageChange={setPage} page={page} />
        ) : null}
      </Box>
    </>
  );
}
