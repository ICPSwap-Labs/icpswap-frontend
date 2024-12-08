import { Trans } from "@lingui/macro";
import { Box, Theme, Typography, makeStyles } from "components/Mui";
import { usePositions } from "hooks/liquidity/usePositions";
import { pageArgsFormat, locationSearchReplace } from "@icpswap/utils";
import { useParsedQueryString } from "@icpswap/hooks";
import { useState } from "react";
import { Header, HeaderCell, LoadingRow, NoData, Pagination, PaginationType, BreadcrumbsV1 } from "@icpswap/ui";
import { SelectPair, InfoWrapper } from "components/index";
import { usePoolByPoolId } from "hooks/swap/usePools";
import { useHistory, useLocation } from "react-router-dom";
import { ToolsWrapper, PrincipalSearcher } from "components/info/tools/index";
import { PositionRow } from "components/liquidity/PositionRow";
import { Null } from "@icpswap/types";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      alignItems: "center",
      padding: "24px",
      borderBottom: `1px solid ${theme.palette.background.level1}`,
      gridTemplateColumns: "200px 120px 120px repeat(3, 1fr)",
      "@media screen and (max-width: 780px)": {
        padding: "16px",
      },
    },
  };
});

export default function Positions() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { pair, principal } = useParsedQueryString() as { pair: string | undefined; principal: string | undefined };

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { loading, result } = usePositions(pair, principal, offset, pagination.pageSize);

  const positions = result?.content;
  const totalElements = result?.totalElements;

  const [, pool] = usePoolByPoolId(pair);

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  const handlePairChange = (pairId: string | undefined) => {
    setPagination({ pageNum: 1, pageSize: pagination.pageSize });
    const search = locationSearchReplace(location.search, "pair", pairId);
    history.push(`/info-tools/positions${search}`);
  };

  const handleAddressChange = (principal: string | Null) => {
    setPagination({ pageNum: 1, pageSize: pagination.pageSize });
    const search = locationSearchReplace(location.search, "principal", principal);
    history.push(`/info-tools/positions${search}`);
  };

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1
        links={[{ label: <Trans>Tools</Trans>, link: "/info-tools" }, { label: <Trans>Positions</Trans> }]}
      />

      <Box sx={{ height: "20px", width: "100%" }} />

      <ToolsWrapper
        title={<Trans>Positions</Trans>}
        action={
          <Box
            sx={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              "@media(max-width: 640px)": {
                flexDirection: "column",
                alignItems: "flex-start",
              },
            }}
          >
            <PrincipalSearcher
              placeholder="Search the principal for positions"
              onPrincipalChange={handleAddressChange}
            />
            <Box sx={{ width: "fit-content", minWidth: "214px" }}>
              <SelectPair value={pair} onPairChange={handlePairChange} search showClean={false} />
            </Box>
            {pair ? <Typography>Swap pool canister ID: {pair}</Typography> : null}
          </Box>
        }
      >
        <Box sx={{ width: "100%", overflow: "auto", margin: "10px 0 0 0" }}>
          <Box sx={{ minWidth: "1200px" }}>
            <Header className={classes.wrapper}>
              <HeaderCell field="Pair">
                <Trans>Owner</Trans>
              </HeaderCell>

              <HeaderCell field="Position ID">
                <Trans>Position ID</Trans>
              </HeaderCell>

              <HeaderCell field="USDValue">
                <Trans>Value</Trans>
              </HeaderCell>

              <HeaderCell field="TokenAmount">
                <Trans>Token Amount</Trans>
              </HeaderCell>

              <HeaderCell field="PriceRange">
                <Trans>Price Range</Trans>
              </HeaderCell>

              <HeaderCell field="UnclaimedFees">
                <Trans>Uncollected fees</Trans>
              </HeaderCell>
            </Header>

            {!loading
              ? positions?.map((ele, index) => (
                  <PositionRow key={index} positionInfo={ele} pool={pool} wrapperClassName={classes.wrapper} />
                ))
              : null}

            {(positions ?? []).length === 0 && !loading ? <NoData /> : null}

            {loading ? (
              <Box
                sx={{
                  padding: "24px",
                  "@media(max-width: 640px)": {
                    padding: "16px",
                  },
                }}
              >
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
                  <div />
                </LoadingRow>
              </Box>
            ) : null}
          </Box>
        </Box>

        <Box
          sx={{
            padding: "24px",
            "@media(max-width: 640px)": {
              padding: "16px",
            },
          }}
        >
          {totalElements && Number(totalElements) !== 0 ? (
            <Pagination
              total={Number(totalElements)}
              num={pagination.pageNum}
              onPageChange={handlePageChange}
              mt="0px"
            />
          ) : null}
        </Box>
      </ToolsWrapper>
    </InfoWrapper>
  );
}
