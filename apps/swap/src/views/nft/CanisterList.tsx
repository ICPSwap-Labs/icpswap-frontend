import { Pagination, NoData, ListLoading, MainCard, TextButton, Wrapper } from "components/index";
import { useUserCanisterList, useCanisterCycles, useCanisterUserNFTCount } from "hooks/nft/useNFTCalls";
import { pageArgsFormat, cycleValueFormat, timestampFormat } from "@icpswap/utils";
import { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
} from "@mui/material";
import { makeStyles, useTheme, Theme } from "components/Mui";
import { useHistory } from "react-router-dom";
import { useAccount } from "store/auth/hooks";
import type { NFTControllerInfo } from "@icpswap/types";
import ExplorerLink from "components/ExternalLink/Explorer";
import CanSVG from "assets/images/nft/CanSVG";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { result: cycles } = useCanisterCycles(canister.cid);
  const account = useAccount();
  const { result: count } = useCanisterUserNFTCount(canister.cid, account);

  return (
    <TableRow>
      <TableCell>
        <Typography>{canister.name}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{timestampFormat(canister.createTime)}</Typography>
      </TableCell>
      <TableCell>
        <ExplorerLink label={canister.cid} value={canister.cid} />
      </TableCell>
      <TableCell>
        <Typography>{String(count ?? 0)}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{cycleValueFormat(cycles ?? "")}</Typography>
      </TableCell>
      <TableCell>
        <TextButton onClick={() => onDetailsClick(canister)}>{t("common.details")}</TextButton>
        <TextButton onClick={() => onMintNFTClick(canister)}>{t("nft.mint")}</TextButton>
      </TableCell>
    </TableRow>
  );
}

export default function NFTCanisterList() {
  const { t } = useTranslation();
  const account = useAccount();
  const history = useHistory();

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
            <TableContainer className={loading ? "with-loading" : ""}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("common.name")}</TableCell>
                    <TableCell>{t("common.time")}</TableCell>
                    <TableCell>{t("common.canister.id")}</TableCell>
                    <TableCell>{t("nft.nfts.count")}</TableCell>
                    <TableCell>{t("common.cycles")}</TableCell>
                    <TableCell>&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {content.map((canister) => (
                    <NFTCanisterListItem
                      key={canister.cid}
                      canister={canister}
                      onDetailsClick={handleLoadDetails}
                      onMintNFTClick={handleLoadMintNFT}
                    />
                  ))}
                </TableBody>
              </Table>
              {content.length === 0 && !loading ? <NoData /> : null}
              <ListLoading loading={loading} />
            </TableContainer>

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
