import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Typography, Avatar, Box, Grid, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Trans } from "@lingui/macro";
import { Wrapper, MainCard } from "components/index";
import { useVotingProjectDetails } from "@icpswap/hooks";
import { Theme } from "@mui/material/styles";
import AuthorityUsers from "components/vote/AuthorityUsers";
import Proposals from "components/vote/Proposals";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

const useStyles = makeStyles((theme: Theme) => {
  return {
    nav: {
      cursor: "pointer",
      "&.active": {
        "& .MuiTypography-root": {
          position: "relative",
          color: theme.palette.text.primary,
          "&::after": {
            content: '""',
            width: "2px",
            height: "100%",
            background: theme.palette.text.primary,
            position: "absolute",
            top: 0,
            left: "-24px",
          },
        },
      },
    },
    nav1: {
      cursor: "pointer",
      paddingBottom: "12px",
      "&.active": {
        "& .MuiTypography-root": {
          position: "relative",
          color: theme.palette.text.primary,
          "&::after": {
            content: '""',
            width: "100%",
            height: "2px",
            background: theme.palette.text.primary,
            position: "absolute",
            bottom: "-12px",
            left: "0",
          },
        },
      },
    },
  };
});

export default function VotingProject() {
  const classes = useStyles();

  const { canisterId } = useParams<{ canisterId: string }>();
  const { result: project } = useVotingProjectDetails(canisterId);

  const [page, setPage] = useState("proposal");

  const history = useHistory();

  const handleNewProposal = () => {
    history.push(`/voting/proposal/create/${canisterId}`);
  };

  const handleTogglePage = (value: string) => {
    setPage(value);
  };

  const matchDown1440 = useMediaQuery("(max-width:1440px)");
  const matchDown720 = useMediaQuery("(max-width:720px)");

  return (
    <Wrapper>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: matchDown1440 ? "1fr" : "340px 1040px",
          gridTemplateRows: matchDown1440 ? "auto 1fr" : "1fr",
          gap: matchDown1440 ? "20px 0" : "0 20px",
        }}
      >
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          {matchDown1440 ? (
            <MainCard padding="0px">
              <Box sx={{ padding: "12px 12px 0 12px" }}>
                <Grid container alignItems="center">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{ width: matchDown720 ? "80px" : "100px", height: matchDown720 ? "80px" : "100px" }}
                      src={project?.logo}
                    >
                      &nbsp;
                    </Avatar>

                    <Box sx={{ margin: "0 0 0 20px" }}>
                      <Typography color="text.primary" fontSize="18px" fontWeight={500}>
                        {project?.name}
                      </Typography>

                      {/* <Box mt="5px">
                        <Typography>
                          {totalHolder !== undefined ? formatAmount(Number(totalHolder), 0) : "--"} holders
                        </Typography>
                      </Box> */}
                    </Box>
                  </Box>
                </Grid>

                <Box mt="20px" sx={{ width: "100%", overflow: "hidden" }}>
                  <ScrollMenu>
                    <Box sx={{ display: "flex", gap: "0 20px", minWidth: "350px" }}>
                      <Box
                        className={`${classes.nav1} ${page === "proposal" ? "active" : ""}`}
                        onClick={() => handleTogglePage("proposal")}
                      >
                        <Typography>
                          <Trans>Proposals</Trans>
                        </Typography>
                      </Box>
                      <Box className={classes.nav1} onClick={handleNewProposal}>
                        <Typography>
                          <Trans>New proposal</Trans>
                        </Typography>
                      </Box>
                      {/* <Box className={classes.nav1}>
                        <Grid container alignItems="center" onClick={handleAbout}>
                          <Typography sx={{ margin: "0 6px 0 0" }}>
                            <Trans>About</Trans>
                          </Typography>

                          <Box sx={{ position: "relative", top: "-3px" }}>
                            <ArrowIcon></ArrowIcon>
                          </Box>
                        </Grid>
                      </Box> */}
                      <Box
                        className={`${classes.nav1} ${page === "setting" ? "active" : ""}`}
                        onClick={() => handleTogglePage("setting")}
                      >
                        <Typography>
                          <Trans>Settings</Trans>
                        </Typography>
                      </Box>
                    </Box>
                  </ScrollMenu>
                </Box>
              </Box>
            </MainCard>
          ) : (
            <MainCard>
              <Box sx={{ padding: "20px 0 0 0", display: "flex", justifyContent: "center" }}>
                <Avatar sx={{ width: "100px", height: "100px" }} src={project?.logo}>
                  &nbsp;
                </Avatar>
              </Box>

              <Box mt="20px">
                <Typography color="text.primary" fontSize="18px" fontWeight={500} align="center">
                  {project?.name}
                </Typography>
              </Box>

              {/* <Box mt="5px">
                <Typography align="center">
                  {totalHolder !== undefined ? formatAmount(Number(totalHolder), 0) : "--"} holders
                </Typography>
              </Box> */}

              <Box mt="40px" sx={{ display: "grid", gridTemplateRows: "1fr 1fr 1px 1fr 1fr", gap: "20px 0" }}>
                <Box
                  className={`${classes.nav} ${page === "proposal" ? "active" : ""}`}
                  onClick={() => handleTogglePage("proposal")}
                >
                  <Typography>
                    <Trans>Proposals</Trans>
                  </Typography>
                </Box>
                <Box className={classes.nav} onClick={handleNewProposal}>
                  <Typography>
                    <Trans>New proposal</Trans>
                  </Typography>
                </Box>
                <Box sx={{ background: "rgba(255, 255, 255, 0.04)", height: "1px" }} />
                {/* <Box className={classes.nav}>
                  <Grid container alignItems="center" onClick={handleAbout}>
                    <Typography sx={{ margin: "0 6px 0 0" }}>
                      <Trans>About</Trans>
                    </Typography>

                    <Box sx={{ position: "relative", top: "-3px" }}>
                      <ArrowIcon></ArrowIcon>
                    </Box>
                  </Grid>
                </Box> */}
                <Box
                  className={`${classes.nav} ${page === "setting" ? "active" : ""}`}
                  onClick={() => handleTogglePage("setting")}
                >
                  <Typography>
                    <Trans>Settings</Trans>
                  </Typography>
                </Box>
              </Box>
            </MainCard>
          )}
        </Box>

        {project && page === "proposal" ? (
          <Box>
            <Proposals project={project} />
          </Box>
        ) : null}

        {page === "setting" ? <AuthorityUsers canisterId={canisterId} /> : null}
      </Box>
    </Wrapper>
  );
}
