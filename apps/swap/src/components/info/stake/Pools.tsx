import { useState } from "react";
import dayjs from "dayjs";
import { useStakingPools, useStakingPoolState } from "@icpswap/hooks";
import { pageArgsFormat, explorerLink } from "@icpswap/utils";
import { TextButton, PaginationType } from "components/index";
import { type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { HeaderCell, BodyCell, NoData, Pagination, Header, TableRow, Flex, ImageLoading } from "@icpswap/ui";
import upperFirst from "lodash/upperFirst";
import { useStateColors } from "hooks/staking-token";
import { useTranslation } from "react-i18next";
import { makeStyles, Box, Link } from "components/Mui";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 120px 120px",
    },
  };
});

function PoolItem({ pool }: { pool: StakingPoolControllerPoolInfo }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const state = useStakingPoolState(pool);
  const stateColor = useStateColors(state);

  return (
    <TableRow className={classes.wrapper}>
      <BodyCell sx={{ alignItems: "center" }}>
        <Link href={explorerLink(pool.canisterId.toString())} target="_blank" sx={{ fontSize: "16px" }}>
          {pool.canisterId.toString()}
        </Link>
      </BodyCell>
      <BodyCell sx={{ alignItems: "center" }}>
        {dayjs(Number(pool.startTime) * 1000).format("YYYY-MM-DD HH:mm")}
      </BodyCell>
      <BodyCell sx={{ alignItems: "center" }}>
        {dayjs(Number(pool.bonusEndTime) * 1000).format("YYYY-MM-DD HH:mm")}
      </BodyCell>
      <BodyCell sx={{ alignItems: "center" }}>
        <Link href={explorerLink(pool.stakingToken.address)} target="_blank" sx={{ fontSize: "16px" }}>
          {pool.stakingTokenSymbol}
        </Link>
      </BodyCell>
      <BodyCell sx={{ alignItems: "center" }}>
        <Link href={explorerLink(pool.rewardToken.address)} target="_blank" sx={{ fontSize: "16px" }}>
          {pool.rewardTokenSymbol}
        </Link>
      </BodyCell>
      <Flex>
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
      </Flex>
      <BodyCell sx={{ alignItems: "center" }}>
        <TextButton to={`/info-stake/details/${pool.canisterId}`} sx={{ fontSize: "16px" }}>
          {t("common.details")}
        </TextButton>
      </BodyCell>
    </TableRow>
  );
}

export function StakePools() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useStakingPools(undefined, offset, pagination.pageSize);
  const { content = [], totalElements = 0 } = result ?? { content: [], totalElements: 0 };

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Box sx={{ width: "100%", minWidth: "1200px" }}>
        <Header className={classes.wrapper}>
          <HeaderCell>{t("common.canister.id")}</HeaderCell>
          <HeaderCell>{t("common.start.time")}</HeaderCell>
          <HeaderCell>{t("common.end.time")}</HeaderCell>
          <HeaderCell>{t("info.staking.token")}</HeaderCell>
          <HeaderCell>{t("common.reward.token")}</HeaderCell>
          <HeaderCell>{t("common.status")}</HeaderCell>
          <HeaderCell>&nbsp;</HeaderCell>
        </Header>

        {content.map((pool) => (
          <PoolItem key={pool.canisterId.toString()} pool={pool} />
        ))}
      </Box>

      {content.length === 0 && !loading ? <NoData /> : null}
      {loading ? <ImageLoading loading={loading} /> : null}
      {Number(totalElements) > 0 ? (
        <Pagination total={Number(totalElements)} num={pagination.pageNum} onPageChange={handlePageChange} />
      ) : null}
    </Box>
  );
}
