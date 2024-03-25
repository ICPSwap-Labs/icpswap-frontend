import { useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Typography, Avatar, Box } from "@mui/material";
import { pageArgsFormat , shortenString } from "@icpswap/utils";
import { Trans, t } from "@lingui/macro";
import { ProposalInfo, ProjectInfo } from "@icpswap/types";
import { Pagination, PaginationType, NoData, StaticLoading, MainCard } from "components/index";
import { VoteStateCount, StateLabel, useVoteState } from "components/vote/VoteState";
import Select from "components/Select";
import { useAccount } from "store/auth/hooks";
import removeMD from "remove-markdown";
import { useVotingProposals } from "@icpswap/hooks";

export interface VoteItemProps {
  proposal: ProposalInfo;
  logo: string | undefined;
  name: string | undefined;
}

export function VoteItem({ proposal, logo, name }: VoteItemProps) {
  const proposalState = useVoteState(proposal);

  return (
    <MainCard level={4}>
      <Grid container alignItems="center">
        <Grid item xs>
          <Grid container alignItems="center">
            <Avatar src={logo} sx={{ marginRight: "12px" }}>
              &nbsp;
            </Avatar>
            <Typography color="secondary" fontSize="18px">
              {proposal.title}
            </Typography>
          </Grid>
        </Grid>
        <StateLabel state={proposalState} />
      </Grid>

      <Box sx={{ paddingLeft: "52px", marginTop: "5px" }}>
        {/* <Typography color="text.primary">{proposal.title}</Typography> */}

        <Typography fontSize="12px" sx={{ lineHeight: "20px" }}>
          {shortenString(removeMD(proposal.content), 360)}
        </Typography>

        <Box mt="14px">
          <VoteStateCount proposal={proposal} />
        </Box>
      </Box>
    </MainCard>
  );
}

export const ProposalStateMens = [
  { value: "all", label: t`All` },
  { value: "active", label: t`Active` },
  { value: "pending", label: t`Pending` },
  { value: "closed", label: t`Closed` },
  // { value: "your", label: "Your" },
];

export const ProposalState: { [key: string]: number } = {
  pending: 1,
  active: 2,
  closed: 3,
};

export default function Proposals({ project }: { project: ProjectInfo }) {
  const account = useAccount();
  const history = useHistory();
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const [activeFilter, setActiveFilter] = useState<string>("all");

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  const filterState: number | undefined = useMemo(() => {
    if (activeFilter === "your" || activeFilter === "all") return undefined;
    return ProposalState[activeFilter];
  }, [activeFilter]);

  const filterAccount = useMemo(() => {
    return activeFilter === "your" ? account : undefined;
  }, [activeFilter, account]);

  const { result, loading } = useVotingProposals(
    project?.projectCid,
    filterAccount,
    filterState,
    offset,
    pagination.pageSize,
  );

  const { content: list, totalElements } = result ?? { content: [] as ProposalInfo[], totalElements: BigInt(0) };

  const handleProposalClick = (proposal: ProposalInfo) => {
    history.push(`/voting/proposal/details/${project.projectCid}/${proposal.id}`);
  };
  return (
    <MainCard>
      <Grid container alignItems="center">
        <Grid item xs>
          <Typography variant="h3">
            <Trans>Proposals</Trans>
          </Typography>
        </Grid>

        <Select menus={ProposalStateMens} value={activeFilter} onChange={(value: any) => setActiveFilter(value)} />
      </Grid>

      <Box mt="20px" sx={{ position: "relative", ...(loading ? { minHeight: "300px" } : {}) }}>
        {list.map((proposal) => (
          <Box
            key={proposal.id}
            sx={{
              marginBottom: "22px",
              cursor: "pointer",
              "&:last-child": {
                marginBottom: "0px",
              },
            }}
            onClick={() => handleProposalClick(proposal)}
          >
            <VoteItem proposal={proposal} logo={project?.logo} name={project.name} />
          </Box>
        ))}

        {loading ? (
          <Box sx={{ position: "absolute", width: "100%", top: "0", left: 0 }}>
            <StaticLoading loading={loading} />
          </Box>
        ) : null}

        {list.length === 0 && !loading ? <NoData /> : null}
      </Box>

      {Number(totalElements) > 0 ? (
        <Pagination
          count={Number(totalElements)}
          defaultPageSize={pagination.pageSize}
          onPageChange={handlePageChange}
        />
      ) : null}
    </MainCard>
  );
}
