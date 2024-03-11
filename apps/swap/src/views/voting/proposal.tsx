import { useState, useRef, useMemo } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { Grid, Typography, Avatar, Box, Breadcrumbs, CircularProgress, useMediaQuery } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { valueofUser } from "@icpswap/utils";
import { Wrapper, MainCard } from "components/index";
import { Trans } from "@lingui/macro";
import { VoteStateCount, StateLabel, useVoteState } from "components/vote/VoteState";
import { Theme } from "@mui/material/styles";
import { VotesResult, CastVotes } from "components/vote/VotesInfo";
import VoteRecords from "components/vote/Records";
import BaseMarkdown from "components/markdown/BaseMarkdown";
import { useDownloadPowers } from "hooks/voting/useDownloadPowers";
import { useVotingProposal } from "@icpswap/hooks";
import DeleteProposalModal from "components/vote/DeleteProposal";
import { useAccount } from "store/auth/hooks";
import { isPrincipal, shorten, principalToAccount } from "@icpswap/utils";

const useStyles = makeStyles(() => ({
  breadcrumbs: {
    "& a": {
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
}));

export default function VotingProposal() {
  const classes = useStyles();
  const account = useAccount();
  const theme = useTheme() as Theme;
  const history = useHistory();
  const { id, canisterId } = useParams<{ id: string; canisterId: string }>();
  const proposalRef = useRef<HTMLDivElement>(null);

  const [refresh, setRefresh] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [deleteProposalShow, setDeleteProposalShow] = useState(false);

  const { result: proposal } = useVotingProposal(canisterId, id, refresh);

  const isCreator = useMemo(() => {
    if (!proposal || !account) return false;

    const val = valueofUser(proposal.createAddress);

    if (isPrincipal(val)) {
      return principalToAccount(val.toString()) === account;
    }

    return val === account;
  }, [proposal, account]);

  const proposalState = useVoteState(proposal);

  const handleVoteSuccess = () => {
    setRefresh(!refresh);
  };

  const markdownBodyHeight = proposalRef.current?.clientHeight ? proposalRef.current?.clientHeight : 0;
  const truncateMarkdownBody = markdownBodyHeight > 400 ? true : false;

  const handleToggleTruncateBody = () => {
    setShowMore(!showMore);
  };

  const [downloading, downloadPowers] = useDownloadPowers(proposal?.storageCanisterId, id);

  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDeleteSuccess = () => {
    history.push(`/voting/${canisterId}`);
  };

  return (
    <Wrapper>
      <>
        <Breadcrumbs className={classes.breadcrumbs}>
          <Link to={`/voting/${canisterId}`}>
            <Typography color="secondary">
              <Trans>Proposals</Trans>
            </Typography>
          </Link>

          <Typography>
            <Trans>Details</Trans>
          </Typography>
        </Breadcrumbs>
      </>

      <Box mt="25px">
        <MainCard>
          <Grid container alignItems="center">
            <Grid item xs>
              <Grid container alignItems="center">
                <Avatar src={proposal?.project.logo} sx={{ marginRight: "12px" }}>
                  &nbsp;
                </Avatar>
                <Typography color="secondary" fontSize="18px">
                  {proposal?.project.name}
                </Typography>
              </Grid>
            </Grid>
            <StateLabel state={proposalState} />
          </Grid>

          <Typography color="text.primary" fontWeight={500} fontSize="18px" sx={{ marginTop: "20px" }}>
            {proposal?.title}
          </Typography>

          <Box mt="10px">
            <Grid container alignItems="center" sx={{ gap: "10px" }}>
              <VoteStateCount proposal={proposal} />
              <Box
                sx={{
                  border: "1px solid #5569DB",
                  padding: "4px 10px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  width: "fit-content",
                }}
              >
                <Typography fontSize="12px">
                  <Trans>Creator:</Trans>
                  {shorten(proposal?.createUser ?? "", 8)}
                </Typography>
              </Box>
              <Box
                sx={{
                  background: "linear-gradient(89.44deg, #5569DB -0.31%, #8572FF 91.14%)",
                  padding: "4px 10px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  width: "fit-content",
                  cursor: "pointer",
                }}
                onClick={downloadPowers}
              >
                {downloading ? <CircularProgress size="14px" sx={{ color: "#ffffff", marginRight: "5px" }} /> : null}
                <Typography fontSize="12px" color="text.primary">
                  <Trans>Voting Power Snapshot</Trans>
                </Typography>
              </Box>

              {isCreator ? (
                <Box
                  sx={{
                    background: "linear-gradient(89.44deg, #5569DB -0.31%, #8572FF 91.14%)",
                    padding: "4px 10px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    width: "fit-content",
                    cursor: "pointer",
                  }}
                  onClick={() => setDeleteProposalShow(true)}
                >
                  <Typography fontSize="12px" color="text.primary">
                    <Trans>Delete proposal</Trans>
                  </Typography>
                </Box>
              ) : null}
            </Grid>
          </Box>

          {!!proposal?.content ? (
            <>
              <Box
                mt="20px"
                sx={{ ...(truncateMarkdownBody && !showMore ? { height: "400px" } : {}), overflow: "hidden" }}
              >
                <Box ref={proposalRef}>
                  <BaseMarkdown content={proposal?.content} />
                </Box>
              </Box>
              {truncateMarkdownBody ? (
                <Box
                  sx={{
                    marginTop: "16px",
                    border: `1px solid #4F5A84`,
                    borderRadius: "23px",
                    padding: "0 20px",
                    width: "fit-content",
                    display: "flex",
                    alignItems: "center",
                    height: "40px",
                    cursor: "pointer",
                  }}
                  onClick={handleToggleTruncateBody}
                >
                  <Typography fontSize="16px" color="text.primary">
                    {!showMore ? <Trans>Show more</Trans> : <Trans>Show less</Trans>}
                  </Typography>
                </Box>
              ) : null}
            </>
          ) : null}
        </MainCard>
      </Box>

      <Box
        mt="20px"
        sx={{
          display: "grid",
          gridTemplateColumns: matchDownSM ? "1fr" : "1fr 1fr",
          gap: matchDownSM ? "20px 0" : "0 20px",
        }}
      >
        <MainCard>
          <Typography color="text.primary" fontWeight="500" sx={{ marginBottom: "20px" }}>
            <Trans>Cast your vote</Trans>
          </Typography>
          {!!proposal ? <CastVotes proposal={proposal} onVoteSuccess={handleVoteSuccess} /> : null}
        </MainCard>

        <MainCard>
          <Typography color="text.primary" fontWeight="500" sx={{ marginBottom: "20px" }}>
            <Trans>Current Results</Trans>
          </Typography>
          {!!proposal ? <VotesResult proposal={proposal} /> : null}
        </MainCard>
      </Box>

      {proposal ? (
        <Box mt="20px">
          <VoteRecords canisterId={proposal.storageCanisterId} id={id} />
        </Box>
      ) : null}

      <DeleteProposalModal
        open={deleteProposalShow}
        onClose={() => setDeleteProposalShow(false)}
        canisterId={canisterId}
        proposalId={id}
        onSuccess={handleDeleteSuccess}
      />
    </Wrapper>
  );
}
