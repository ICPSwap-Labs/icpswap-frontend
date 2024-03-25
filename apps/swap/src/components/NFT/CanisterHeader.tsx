import { useState, useRef } from "react";
import { Box, Grid, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { cycleValueFormat } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { useAccount } from "store/global/hooks";
import { Trans } from "@lingui/macro";
import type { NFTControllerInfo } from "@icpswap/types";
import { Theme } from "@mui/material/styles";
import ExternalLink from "components/ExternalLink/index";
import TopUpCanister from "components/modal/TopUpCanister";
import { INFO_URL } from "constants/index";
import LoadingRow from "components/Loading/LoadingRow";
import { Modal } from "components/index";
import Upload, { UploadRef } from "components/NFT/Upload";
import { setCanisterLogo } from "hooks/nft/useNFTCalls";
import { useTips, TIP_ERROR, TIP_SUCCESS } from "hooks/useTips";
import Avatar from "components/Image/Avatar";

const useStyles = makeStyles((theme: Theme) => ({
  infoCard: {
    display: "inline-block",
    background: theme.palette.background.level4,
    borderRadius: "12px",
    padding: "20px",
  },

  wrapper: {
    background: theme.palette.background.level2,
    padding: "30px",
    borderRadius: "12px",
    display: "grid",
    gridTemplateColumns: "85px auto fit-content(260px)",
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "1fr",
      padding: "10px",
    },
  },

  content: {
    paddingLeft: "30px",
    [theme.breakpoints.down("md")]: {
      paddingLeft: "0px",
      marginTop: "10px",
    },
  },

  name: {
    fontSize: "28px",
    fontWeight: "700",
    color: theme.palette.text.primary,
    [theme.breakpoints.down("md")]: {
      fontSize: "18px",
      fontWeight: "500",
    },
  },

  description: {
    maxWidth: "80%",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%",
    },
  },

  button: {
    [theme.breakpoints.down("md")]: {
      marginTop: "10px",
    },
  },
}));

export interface UploadImageModalProps {
  canisterId: string;
  open: boolean;
  onClose?: () => void;
}

function UploadImageModal({ canisterId, open, onClose }: UploadImageModalProps) {
  const uploadRef = useRef<UploadRef>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const [openTip] = useTips();

  const handleFileChange = (file: File) => {
    setFile(file);
  };

  const handleFileError = (fileError: string) => {
    setFileError(fileError);
  };

  const handleUpload = async () => {
    const { filePath } = (await uploadRef.current?.uploadCb(true)) ?? {};

    if (filePath) {
      const { status, message } = await setCanisterLogo(true, canisterId, filePath);
      if (status === ResultStatus.ERROR) {
        openTip(message ?? "Failed to upload, please try again later", TIP_ERROR);
      } else {
        openTip("Upload successfully", TIP_SUCCESS);
        if (onClose) onClose();
      }
    } else {
      openTip("Failed to upload, please try again later", TIP_ERROR);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: "20px" }}>
        <Upload
          ref={uploadRef}
          maxSize={200 * 1024}
          types={["image"]}
          accept=".jpeg, .png, .jpg, .gif, .apng"
          placeholder="Upload your file"
          canisterId={canisterId}
          uploadImmediately={false}
          onFileSelected={handleFileChange}
          onFileError={handleFileError}
          uploadWithIdentity
          minHeight="220px"
        />
        <Typography sx={{ marginTop: "5px" }}>
          <Trans>Support : image Size: ≤200K</Trans>
        </Typography>
      </Box>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Button fullWidth variant="contained" onClick={handleUpload} disabled={!file || !!fileError}>
          <Trans>Upload</Trans>
        </Button>
      </Box>
    </Modal>
  );
}

export interface NFTCanisterHeaderProps {
  details: NFTControllerInfo;
  cycles: number | bigint;
  count: number | bigint;
  loading?: boolean;
}

export default function CanisterHeader({ details, cycles, count, loading }: NFTCanisterHeaderProps) {
  const classes = useStyles();
  const history = useHistory();
  const account = useAccount();
  const theme = useTheme();

  const matchDownMD = useMediaQuery(theme.breakpoints.down("sm"));

  const isOwner = details?.owner === account;

  const [topUpCycles, setTopUpCycles] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleMintNFT = () => {
    history.push(`/console/nft/mint?canister=${details.cid}`);
  };

  const handleToMarketplace = () => {
    history.push(`/marketplace/NFT/${details.cid}`);
  };

  const handleAvatarClick = () => {
    if (isOwner) {
      setUploadModalOpen(true);
    }
  };

  return (
    <>
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
        </LoadingRow>
      ) : (
        <Box className={classes.wrapper}>
          <Avatar
            src={details.image}
            sx={{
              width: "85px",
              height: "85px",
            }}
            onClick={handleAvatarClick}
          />

          <Box className={classes.content}>
            <Typography className={classes.name}>{details.name}</Typography>

            <Box mt="20px">
              <Grid sx={{ width: "100%" }} container alignItems="center">
                <Typography color="text.primary">
                  <Trans>Canister ID:</Trans>
                </Typography>
                <Grid item xs ml="5px">
                  <ExternalLink label={details.cid} value={`${INFO_URL}/nft/canister/details/${details.cid}`} />
                </Grid>
              </Grid>
            </Box>

            <Box mt={1}>
              <Typography color="text.tertiary" className={classes.description}>
                {details.introduction}
              </Typography>
            </Box>

            <Grid container mt="20px">
              <Button
                variant="contained"
                size={matchDownMD ? "small" : "large"}
                sx={{
                  marginRight: "12px",
                }}
                onClick={handleToMarketplace}
              >
                <Trans>Marketplace</Trans>
              </Button>

              {isOwner ? (
                <Button
                  variant="contained"
                  size={matchDownMD ? "small" : "large"}
                  color="secondary"
                  sx={{
                    marginRight: "12px",
                  }}
                  onClick={handleMintNFT}
                >
                  <Trans>Mint NFT</Trans>
                </Button>
              ) : null}

              <Button
                variant="contained"
                size={matchDownMD ? "small" : "large"}
                color="secondary"
                onClick={() => setTopUpCycles(true)}
              >
                <Trans>Top-up Canister</Trans>
              </Button>
            </Grid>
          </Box>

          <Box className={classes.button}>
            <Box
              className={classes.infoCard}
              sx={{
                marginRight: "20px",
              }}
            >
              <Typography color="text.primary" fontWeight={700} fontSize="18px">
                {cycleValueFormat(cycles)}
              </Typography>
              <Typography
                sx={{
                  marginTop: "4px",
                }}
              >
                <Trans>Cycles</Trans>
              </Typography>
            </Box>
            <Box className={classes.infoCard}>
              <Typography color="text.primary" fontWeight={700} fontSize="18px" align="center">
                {Number(count)}
              </Typography>
              <Typography
                sx={{
                  marginTop: "4px",
                }}
              >
                <Trans>NFT count</Trans>
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <TopUpCanister
        open={topUpCycles}
        onClose={() => setTopUpCycles(false)}
        onTopUpSuccess={() => setTopUpCycles(false)}
        cyclesBalance={cycles}
        canisterId={details.cid}
      />

      <UploadImageModal canisterId={details.cid} open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </>
  );
}
