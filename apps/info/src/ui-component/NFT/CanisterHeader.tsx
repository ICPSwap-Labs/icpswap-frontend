import { Box, Grid, Avatar, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { cycleValueFormat } from "utils";
import { Trans } from "@lingui/macro";
import type { NFTCanisterInfo } from "@icpswap/types";
import { Theme } from "@mui/material/styles";
import ExplorerLink from "ui-component/ExternalLink/ExplorerLink";
import { APP_LINK } from "constants/index";
import { mockALinkAndOpen } from "@icpswap/utils";

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

export interface NFTCanisterHeaderProps {
  details: NFTCanisterInfo | undefined;
  cycles: number | bigint;
  count: number | bigint;
}

export default function CanisterHeader({ details, cycles }: NFTCanisterHeaderProps) {
  const classes = useStyles();

  const handleToMarketplace = () => {
    if (!details?.cid) return;
    mockALinkAndOpen(`${APP_LINK}/marketplace/NFT/${details.cid}`, "NFT_Marketplace_load");
  };

  return (
    <>
      <Box className={classes.wrapper}>
        <Avatar
          src={details?.image}
          sx={{
            width: "85px",
            height: "85px",
          }}
        >
          &nbsp;
        </Avatar>

        <Box className={classes.content}>
          <Typography className={classes.name}>{details?.name}</Typography>

          <Box mt="20px">
            <Grid sx={{ width: "100%" }} container alignItems="center">
              <Typography color="text.primary">
                <Trans>Canister ID:</Trans>
              </Typography>
              {details ? (
                <Grid item xs ml="5px">
                  <ExplorerLink label={details.cid} value={details.cid} />
                </Grid>
              ) : null}
            </Grid>
          </Box>

          <Box mt={1}>
            <Typography color="text.tertiary" className={classes.description}>
              {details?.introduction}
            </Typography>
          </Box>

          <Box mt="20px">
            <Button variant="contained" size="large" onClick={handleToMarketplace}>
              <Trans>Marketplace</Trans>
            </Button>
          </Box>
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
        </Box>
      </Box>
    </>
  );
}
