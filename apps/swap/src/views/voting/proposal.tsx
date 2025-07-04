import { useState, useRef, useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Grid, Typography, Avatar, Box, CircularProgress, useMediaQuery, useTheme } from "components/Mui";
import { valueofUser, isPrincipal, shorten, principalToAccount } from "@icpswap/utils";
import { Wrapper, MainCard, Breadcrumbs } from "components/index";
import { VoteStateCount, StateLabel, useVoteState } from "components/vote/VoteState";
import { VotesResult, CastVotes } from "components/vote/VotesInfo";
import VoteRecords from "components/vote/Records";
import { useDownloadPowers } from "hooks/voting/useDownloadPowers";
import { useVotingProposal } from "@icpswap/hooks";
import DeleteProposalModal from "components/vote/DeleteProposal";
import { useAccount } from "store/auth/hooks";
import { useTranslation } from "react-i18next";
import { Markdown } from "components/markdown/BaseMarkdown";

export default function VotingProposal() {
  const { t } = useTranslation();
  const account = useAccount();
  const theme = useTheme();
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
  const truncateMarkdownBody = markdownBodyHeight > 400;

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
      <Breadcrumbs
        prevLink={`/voting/${canisterId}`}
        prevLabel={t("common.proposals")}
        currentLabel={t("common.details")}
      />

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
                  {t("common.creator.colon")}
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
                  {t("voting.snapshot")}
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
                    {t("voting.delete.proposal")}
                  </Typography>
                </Box>
              ) : null}
            </Grid>
          </Box>

          {proposal?.content ? (
            <>
              <Box
                mt="20px"
                sx={{ ...(truncateMarkdownBody && !showMore ? { height: "400px" } : {}), overflow: "hidden" }}
              >
                <Box ref={proposalRef}>
                  <Markdown content={proposal.content} />
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
                    {!showMore ? t("common.show.more") : t("common.show.less")}
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
            {t("voting.cast.vote")}
          </Typography>
          {proposal ? <CastVotes proposal={proposal} onVoteSuccess={handleVoteSuccess} /> : null}
        </MainCard>

        <MainCard>
          <Typography color="text.primary" fontWeight="500" sx={{ marginBottom: "20px" }}>
            {t("voting.current.results")}
          </Typography>
          {proposal ? <VotesResult proposal={proposal} /> : null}
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
