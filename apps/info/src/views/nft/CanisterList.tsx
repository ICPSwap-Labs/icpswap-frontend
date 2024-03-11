import { pageArgsFormat } from "@icpswap/utils";
import { cycleValueFormat } from "utils/index";
import { useState } from "react";
import { Typography, Box, Avatar, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { useCanisterCycles, useCanisterNFTCount } from "hooks/nft/calls";
import { Trans } from "@lingui/macro";
import { MainContainer, Pagination, NoData, LoadingRow, MainCard, TextButton } from "ui-component/index";
import { NFTCanisterInfo } from "@icpswap/types";
import { useNFTCanisters } from "@icpswap/hooks";
import { Header, HeaderCell, Row, BodyCell } from "ui-component/Table";
import { timestampFormat } from "@icpswap/utils";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr) 120px 120px 80px",
      padding: "16px",
      alignItems: "center",
      minWidth: "1200px",
    },
  };
});

export interface NFTItemProps {
  canister: NFTCanisterInfo;
}

export function NFTItem({ canister }: NFTItemProps) {
  const classes = useStyles();
  const { result: cycles } = useCanisterCycles(canister.cid);
  const { result: count } = useCanisterNFTCount(canister.cid);

  return (
    <Row className={classes.wrapper}>
      <BodyCell>
        <Grid container alignItems="center" gap="0 6px">
          <Avatar src={canister?.image}>&nbsp;</Avatar>
          <BodyCell>{canister.name}</BodyCell>
        </Grid>
      </BodyCell>
      <BodyCell>{timestampFormat(canister.createTime)}</BodyCell>
      <BodyCell>{canister.cid}</BodyCell>
      <BodyCell>{cycleValueFormat(cycles ?? "")}</BodyCell>
      <BodyCell>{String(count ?? 0)}</BodyCell>
      <BodyCell>
        <TextButton to={`/nft/canister/details/${canister.cid}`}>
          <Trans>Details</Trans>
        </TextButton>
      </BodyCell>
    </Row>
  );
}

export default function NFTCanisterList() {
  const classes = useStyles();
  const history = useHistory();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { result, loading } = useNFTCanisters(offset, pagination.pageSize);
  const { content, totalElements } = result ?? { totalElements: 0, content: [] as NFTCanisterInfo[] };

  return (
    <MainContainer>
      <MainCard>
        <Box mb="20px">
          <Typography variant="h3">
            <Trans>NFT Canisters</Trans>
          </Typography>
        </Box>

        <Box sx={{ overflow: "auto" }}>
          <Header className={classes.wrapper}>
            <HeaderCell>
              <Trans>Name</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>Time</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>Canister ID</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>Cycles</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>NFT count</Trans>
            </HeaderCell>
            <HeaderCell>&nbsp;</HeaderCell>
          </Header>

          {(loading ? [] : content).map((canister) => (
            <NFTItem key={canister.cid} canister={canister} />
          ))}

          {content.length === 0 && !loading ? <NoData /> : null}

          {loading ? (
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
              <div />
            </LoadingRow>
          ) : null}
        </Box>

        {totalElements && Number(totalElements) !== 0 ? (
          <Pagination
            total={Number(totalElements)}
            num={pagination.pageNum}
            onPageChange={(pagination) => setPagination(pagination)}
          />
        ) : null}
      </MainCard>
    </MainContainer>
  );
}
