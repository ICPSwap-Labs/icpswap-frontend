import { useState, useEffect } from "react";
import { Box, Button, Typography, Grid, CircularProgress } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import NFTCard from "components/NFT/market/NFTCard";
import { getTradeOrders } from "hooks/nft/trade";
import NoData from "components/no-data";
import { isValidAccount, pageArgsFormat } from "@icpswap/utils";
import Loading from "components/Loading/Static";
import { TradeOrder } from "types/nft";
import { Trans } from "@lingui/macro";

const useStyles = makeStyles(() => {
  return {
    collectionContainer: {
      position: "relative",
      display: "grid",
      gridGap: "10px 20px",
      gridTemplateColumns: "1fr 1fr 1fr",
      width: "fit-content",
      "@media (max-width:479px)": {
        position: "static",
        right: "0",
        gridGap: "20px 10px",
        gridTemplateColumns: "1fr",
        width: "auto",
      },
      "@media (min-width:480px) and (max-width:719px)": {
        position: "static",
        right: "0",
        gridGap: "20px 10px",
        gridTemplateColumns: "1fr 1fr",
        width: "auto",
      },
      "@media (min-width:720px) and (max-width:960px)": {
        position: "static",
        right: "0",
        gridGap: "20px 10px",
        gridTemplateColumns: "1fr 1fr 1fr",
        width: "auto",
      },
      "@media (min-width:961px) and (max-width:1240px)": {
        position: "static",
        right: "0",
        gridGap: "20px 10px",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        width: "auto",
      },
      "@media (min-width:1241px) ": {
        position: "static",
        right: "0",
        gridGap: "20px 10px",
        gridTemplateColumns: "repeat(6, 1fr)",
        width: "auto",
      },
    },
  };
});

let page = 1;
const pageSize = 24;

export default function NFTMarketOrders({
  searchValue,
  sortBy,
  canisterId,
}: {
  searchValue: string;
  sortBy: string | null | undefined;
  canisterId?: string;
}) {
  const classes = useStyles();
  const theme = useTheme() as Theme;
  const [data, setData] = useState<TradeOrder[]>([]);
  const [firstLoading, setFirstLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [totalElements, setTotalElements] = useState<bigint | number>(BigInt(0));

  const isAddress = isValidAccount(searchValue);

  useEffect(() => {
    const [offset] = pageArgsFormat(1, pageSize);

    const call = async () => {
      setFirstLoading(true);

      page = 1;

      const result = await getTradeOrders(
        canisterId,
        isAddress ? null : searchValue,
        isAddress ? searchValue : null,
        null,
        offset,
        pageSize,
        sortBy ? sortBy.split("-")[0] : "",
        !sortBy?.split("-")[1],
      );

      const { totalElements, content } = result ?? { totalElements: BigInt(0), content: [] as TradeOrder[] };

      setData(content);
      setTotalElements(totalElements);

      setFirstLoading(false);
    };

    call();
  }, [sortBy, searchValue, canisterId]);

  const handleLoadMore = async () => {
    if (firstLoading || moreLoading) return;

    setMoreLoading(true);

    page++;

    const [offset] = pageArgsFormat(page, pageSize);

    const result = await getTradeOrders(
      canisterId,
      isAddress ? null : searchValue,
      isAddress ? searchValue : null,
      null,
      offset,
      pageSize,
      sortBy ? sortBy.split("-")[0] : "",
      !sortBy?.split("-")[1],
    );

    const { content } = result ?? { totalElements: 0, content: [] as TradeOrder[] };

    setMoreLoading(false);

    setData([...data, ...content]);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "300px",
      }}
    >
      <Box className={classes.collectionContainer}>
        {data.map((order, index) => (
          <Box
            key={`${String(order.tokenIndex)}-${index}-${order.hash}`}
            sx={{
              overflow: "hidden",
            }}
          >
            <NFTCard order={order} />
          </Box>
        ))}
      </Box>

      {data && data.length === 0 && !firstLoading ? <NoData /> : null}

      {/* {totalElements && Number(totalElements) !== 0 ? (
        <Box mt="20px">
          <Pagination
            count={Number(totalElements)}
            onPageChange={handlePageChange}
            defaultPageSize={pagination.pageSize}
          />
        </Box>
      ) : null} */}

      {Number(totalElements) > pageSize && data.length > 0 && data.length !== Number(totalElements) ? (
        <Grid container justifyContent="center" mt="40px">
          <Button
            variant="outlined"
            size="large"
            sx={{
              "&.MuiButton-outlined.MuiButton-outlinedPrimary": {
                color: theme.palette.text.secondary,
                borderColor: theme.palette.text.secondary,
                height: "42px",
                minWidth: "132px",
              },
            }}
            onClick={handleLoadMore}
          >
            {moreLoading ? <CircularProgress size={18} color="inherit" sx={{ margin: "0 4px 0 0" }} /> : null}
            <Typography fontWeight={600}>
              <Trans>View More</Trans>
            </Typography>
          </Button>
        </Grid>
      ) : null}

      {firstLoading ? (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Loading loading={firstLoading} mask />
        </Box>
      ) : null}
    </Box>
  );
}
