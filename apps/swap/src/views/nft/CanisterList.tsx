import { Pagination, NoData, MainCard, TextButton, Wrapper } from "components/index";
import { useUserCanisterList, useCanisterCycles, useCanisterUserNFTCount } from "hooks/nft/useNFTCalls";
import { pageArgsFormat, cycleValueFormat, timestampFormat } from "@icpswap/utils";
import { useState } from "react";
import { Grid, Typography, Button, Box, useMediaQuery, makeStyles, useTheme, Theme } from "components/Mui";
import { useHistory } from "react-router-dom";
import { useAccount } from "store/auth/hooks";
import type { NFTControllerInfo } from "@icpswap/types";
import ExplorerLink from "components/ExternalLink/Explorer";
import CanSVG from "assets/images/nft/CanSVG";
import { useTranslation } from "react-i18next";
import { TableRow, Header, HeaderCell, BodyCell, ImageLoading } from "@icpswap/ui";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: "300px",
    [theme.breakpoints.down("md")]: {
      height: "225px",
    },
  },
  title: {
    color: "#fff",
    fontSize: "32px",
    lineHeight: "44px",
    margin: "0",
    [theme.breakpoints.down("md")]: {
      fontSize: "24px",
    },
  },
  wrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(6,1fr)",
  },
}));

export function Title() {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));

  const handleCreateCanister = () => {
    history.push("/info-tools/nft/canister/create");
  };

  return (
    <Grid className={classes.container} container alignItems="center">
      <Grid item xs>
        <Box>
          <Typography className={classes.title} fontWeight="700">
            {t("nft.create.canister.to.mint")}
          </Typography>
        </Box>
        <Box mt="20px">
          <Button size="large" variant="contained" onClick={handleCreateCanister}>
            {t("nft.create.a.canister")}
          </Button>
        </Box>
      </Grid>
      {!matchesMd ? (
        <Grid
          item
          sx={{
            width: "386px",
            height: "274px",
          }}
        >
          <CanSVG />
        </Grid>
      ) : null}
    </Grid>
  );
}

export function NFTCanisterListItem({
  canister,
  onDetailsClick,
  onMintNFTClick,
}: {
  canister: NFTControllerInfo;
  onDetailsClick: (canister: NFTControllerInfo) => void;
  onMintNFTClick: (canister: NFTControllerInfo) => void;
}) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { result: cycles } = useCanisterCycles(canister.cid);
  const account = useAccount();
  const { result: count } = useCanisterUserNFTCount(canister.cid, account);

  return (
    <TableRow className={classes.wrapper}>
      <BodyCell>{canister.name}</BodyCell>
      <BodyCell>{timestampFormat(canister.createTime)}</BodyCell>
      <ExplorerLink label={canister.cid} value={canister.cid} />
      <BodyCell>{String(count ?? 0)}</BodyCell>
      <BodyCell>{cycleValueFormat(cycles ?? "")}</BodyCell>
      <BodyCell>
        <TextButton onClick={() => onDetailsClick(canister)}>{t("common.details")}</TextButton>
        <TextButton onClick={() => onMintNFTClick(canister)}>{t("nft.mint")}</TextButton>
      </BodyCell>
    </TableRow>
  );
}

export default function NFTCanisterList() {
  const { t } = useTranslation();
  const account = useAccount();
  const history = useHistory();
  const classes = useStyles();

  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });

  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);
  const { result, loading } = useUserCanisterList(account, offset, pagination.pageSize);
  const { content, totalElements } = result ?? { content: [] as NFTControllerInfo[], totalElements: 0 };

  const handleLoadDetails = (canisterInfo: NFTControllerInfo) => {
    history.push(`/wallet/nft/canister/details/${canisterInfo.cid}`);
  };

  const handleLoadMintNFT = (canisterInfo: NFTControllerInfo) => {
    history.push(`/info-tools/nft/mint?canister=${canisterInfo.cid}`);
  };

  return (
    <Wrapper>
      <>
        <Title />
        <Grid mt="20px">
          <MainCard>
            <Box mb={3}>
              <Typography variant="h3">{t("canister.list")}</Typography>
            </Box>
            <Box sx={{ width: "100%", overflow: "auto" }}>
              <Box sx={{ width: "100%", minWidth: "960px" }}>
                <Header className={classes.wrapper}>
                  <HeaderCell>{t("common.name")}</HeaderCell>
                  <HeaderCell>{t("common.time")}</HeaderCell>
                  <HeaderCell>{t("common.canister.id")}</HeaderCell>
                  <HeaderCell>{t("nft.nfts.count")}</HeaderCell>
                  <HeaderCell>{t("common.cycles")}</HeaderCell>
                  <HeaderCell>&nbsp;</HeaderCell>
                </Header>

                <>
                  {content.map((canister) => (
                    <NFTCanisterListItem
                      key={canister.cid}
                      canister={canister}
                      onDetailsClick={handleLoadDetails}
                      onMintNFTClick={handleLoadMintNFT}
                    />
                  ))}
                </>
              </Box>
              {content.length === 0 && !loading ? <NoData /> : null}
              <ImageLoading loading={loading} />
            </Box>

            {totalElements && Number(totalElements) !== 0 ? (
              <Pagination
                count={Number(totalElements)}
                defaultPageSize={pagination.pageSize}
                onPageChange={setPagination}
              />
            ) : null}
          </MainCard>
        </Grid>
      </>
    </Wrapper>
  );
}
