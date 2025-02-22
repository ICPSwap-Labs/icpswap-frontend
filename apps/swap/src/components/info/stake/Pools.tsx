import { useState } from "react";
import { Grid, Table, TableHead, TableCell, TableContainer, TableRow, TableBody, Box, Link } from "@mui/material";
import dayjs from "dayjs";
import { useStakingPools, useStakingPoolState } from "@icpswap/hooks";
import { pageArgsFormat, explorerLink } from "@icpswap/utils";
import { TextButton, ListLoading, PaginationType } from "components/index";
import { type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { HeaderCell, BodyCell, NoData, Pagination } from "@icpswap/ui";
import upperFirst from "lodash/upperFirst";
import { useStateColors } from "hooks/staking-token";
import { useTranslation } from "react-i18next";

function PoolItem({ pool }: { pool: StakingPoolControllerPoolInfo }) {
  const { t } = useTranslation();
  const state = useStakingPoolState(pool);
  const stateColor = useStateColors(state);

  return (
    <TableRow>
      <TableCell>
        <Link href={explorerLink(pool.canisterId.toString())} target="_blank" sx={{ fontSize: "16px" }}>
          {pool.canisterId.toString()}
        </Link>
      </TableCell>
      <TableCell>
        <BodyCell>{dayjs(Number(pool.startTime) * 1000).format("YYYY-MM-DD HH:mm")}</BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>{dayjs(Number(pool.bonusEndTime) * 1000).format("YYYY-MM-DD HH:mm")}</BodyCell>
      </TableCell>
      <TableCell>
        <Link href={explorerLink(pool.stakingToken.address)} target="_blank" sx={{ fontSize: "16px" }}>
          {pool.stakingTokenSymbol}
        </Link>
      </TableCell>
      <TableCell>
        <Link href={explorerLink(pool.rewardToken.address)} target="_blank" sx={{ fontSize: "16px" }}>
          {pool.rewardTokenSymbol}
        </Link>
      </TableCell>
      <TableCell>
        <Grid container alignItems="center">
          <Box
            sx={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: stateColor,
              marginRight: "8px",
            }}
          />
          <BodyCell
            sx={{
              color: stateColor,
            }}
          >
            {state ? (state === "NOT_STARTED" ? "Unstart" : upperFirst(state.toLocaleLowerCase())) : "--"}
          </BodyCell>
        </Grid>
      </TableCell>
      <TableCell>
        <TextButton to={`/info-stake/details/${pool.canisterId}`} sx={{ fontSize: "16px" }}>
          {t("common.details")}
        </TextButton>
      </TableCell>
    </TableRow>
  );
}

export function StakePools() {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useStakingPools(undefined, offset, pagination.pageSize);
  const { content = [], totalElements = 0 } = result ?? { content: [], totalElements: 0 };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <TableContainer className={loading ? "with-loading" : ""}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <HeaderCell>{t("common.canister.id")}</HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>{t("common.start.time")}</HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>{t("common.end.time")}</HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>{t("info.staking.token")}</HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>{t("common.reward.token")}</HeaderCell>
            </TableCell>
            <TableCell>
              <HeaderCell>{t("common.status")}</HeaderCell>
            </TableCell>
            <TableCell>&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {content.map((pool) => (
            <PoolItem key={pool.canisterId.toString()} pool={pool} />
          ))}
        </TableBody>
      </Table>
      {content.length === 0 && !loading ? <NoData /> : null}
      {loading ? <ListLoading loading={loading} /> : null}
      {Number(totalElements) > 0 ? (
        <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={handlePageChange} />
      ) : null}
    </TableContainer>
  );
}
