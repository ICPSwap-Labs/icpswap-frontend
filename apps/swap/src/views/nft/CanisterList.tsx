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
import { makeStyles, useTheme } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { useAccount } from "store/global/hooks";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import type { NFTControllerInfo } from "@icpswap/types";
import ExplorerLink from "components/ExternalLink/Explorer";
import CanSVG from "assets/images/nft/CanSVG";

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
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme() as Theme;
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));

  const handleCreateCanister = () => {
    history.push("/info-tools/nft/canister/create");
  };

  return (
    <Grid className={classes.container} container alignItems="center">
      <Grid item xs>
        <Box>
          <Typography className={classes.title} fontWeight="700">
            <Trans>Create a canister to mint your NFTs</Trans>
          </Typography>
        </Box>
        <Box mt="20px">
          <Button size="large" variant="contained" onClick={handleCreateCanister}>
            <Trans>Create a canister</Trans>
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
        <TextButton onClick={() => onDetailsClick(canister)}>
          <Trans>Details</Trans>
        </TextButton>
        <TextButton onClick={() => onMintNFTClick(canister)}>
          <Trans>Mint NFT</Trans>
        </TextButton>
      </TableCell>
    </TableRow>
  );
}

export default function NFTCanisterList() {
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
              <Typography variant="h3">
                <Trans>Canister List</Trans>
              </Typography>
            </Box>
            <TableContainer className={loading ? "with-loading" : ""}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Trans>Name</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans>Time</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans>Canister ID</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans>NFTs count</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans>Cycles</Trans>
                    </TableCell>
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
