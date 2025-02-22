import { Box, Typography, useTheme } from "components/Mui";
import { useListDeployedSNSs, getListProposals, useParsedQueryString } from "@icpswap/hooks";
import type { ProposalData } from "@icpswap/types";
import { shortenString, nowInSeconds } from "@icpswap/utils";
import { useMemo, useState, useEffect } from "react";
import { SnsProposalDecisionStatus } from "@icpswap/constants";
import { SelectSns } from "components/sns/SelectSNSTokens";
import { secondsToDuration } from "@dfinity/utils";
import { Tabs } from "components/sns/Tab";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory } from "react-router-dom";
import { LoadingRow, Wrapper, Link } from "components/index";
import { SelectNeuronFuncs } from "components/sns/SelectNeuronFuncs";
import { SelectNeuronProposalStatus } from "components/sns/SelectNeuronProposalStatus";
import { useTranslation } from "react-i18next";

import { getProposalStatus } from "./proposal.utils";

interface ProposalItemProps {
  proposal: ProposalData;
  governance_id: string | undefined;
}

function ProposalItem({ proposal, governance_id }: ProposalItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const { title, summary, seconds, isExecuted } = useMemo(() => {
    const __proposal = proposal.proposal[0];

    if (!__proposal) return {};

    const deadline = proposal.wait_for_quiet_state[0]?.current_deadline_timestamp_seconds;

    return {
      url: __proposal.url,
      title: __proposal.title,
      action: __proposal.action,
      summary: __proposal.summary,
      seconds: deadline ? deadline - BigInt(nowInSeconds()) : undefined,
      isExecuted: proposal.executed_timestamp_seconds > 0,
    };
  }, [proposal]);

  const proposal_id = useMemo(() => {
    return proposal.id[0]?.id;
  }, [proposal]);

  const proposal_status_text = useMemo(() => {
    const proposal_status = getProposalStatus(proposal);

    switch (proposal_status) {
      case SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_ADOPTED:
        return t("common.adopted");
      case SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_EXECUTED:
        return t`Executed`;
      case SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_FAILED:
        return t`Failed`;
      case SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_OPEN:
        return t`Open`;
      case SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_REJECTED:
        return t`Rejected`;
      default:
        return t("common.unspecified");
    }
  }, [proposal]);

  return (
    <Box
      sx={{
        background: theme.palette.background.level4,
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
        "@media(max-width: 640px)": {
          padding: "10px",
        },
      }}
    >
      <Link to={`/sns/voting/${governance_id}/${proposal_id}`} width="100%" height="100%" display="block">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>ID: {proposal.id[0]?.id.toString() ?? "--"}</Typography>

          <Box
            sx={{
              padding: "3px 10px",
              borderRadius: "12px",
              background: proposal_status_text === "Open" ? theme.colors.successDark : theme.palette.background.level1,
            }}
          >
            <Typography color="text.primary">{proposal_status_text}</Typography>
          </Box>
        </Box>

        <Typography sx={{ color: "text.primary", wordBreak: "break-all", lineHeight: "16px", margin: "10px 0 0 0" }}>
          {title}
        </Typography>

        <Typography sx={{ margin: "10px 0 0 0", fontSize: "12px", wordBreak: "break-word", lineHeight: "16px" }}>
          {summary ? shortenString(summary, 150) : "--"}
        </Typography>

        {isExecuted ? null : (
          <Typography sx={{ margin: "20px 0 0 0" }}>{seconds ? secondsToDuration({ seconds }) : "--"}</Typography>
        )}
      </Link>
    </Box>
  );
}

const sns_proposals_limit = 50;

export default function Votes() {
  const history = useHistory();
  const { root_id: root_id_url } = useParsedQueryString() as { root_id: string };
  const [loading, setLoading] = useState(false);
  const [fetchDone, setFetchDone] = useState(false);
  const [allProposals, setAllProposals] = useState<ProposalData[]>([]);
  const [filterStatus, setFilterStatus] = useState<SnsProposalDecisionStatus[]>([]);
  const [excludeFuncIds, setExcludeFuncIds] = useState<bigint[]>([]);

  const root_id = useMemo(() => {
    return root_id_url ?? "csyra-haaaa-aaaaq-aacva-cai";
  }, [root_id_url]);

  const { result: listedSNS } = useListDeployedSNSs();

  const sns = useMemo(() => {
    if (!root_id || !listedSNS) return undefined;
    return listedSNS.instances.find((e) => e.root_canister_id.toString() === root_id);
  }, [listedSNS, root_id]);

  const { governance_id } = useMemo(() => {
    if (!sns) return { governance_id: undefined, ledger_id: undefined };

    const governance_canister_id = sns.governance_canister_id[0];
    const ledger_canister_id = sns.ledger_canister_id[0];

    return { governance_id: governance_canister_id?.toString(), ledger_id: ledger_canister_id?.toString() };
  }, [sns]);

  const reset_state = () => {
    setFilterStatus([]);
    setFetchDone(false);
    setAllProposals([]);
  };

  const handleSelectNeuronChange = (id: string) => {
    reset_state();
    history.push(`/sns/voting?root_id=${id}`);
  };

  const proposals = useMemo(() => {
    if (!allProposals) return undefined;
    return [...allProposals];
  }, [allProposals]);

  const fetch_proposals = async () => {
    if (fetchDone || loading || !governance_id) return;

    setLoading(true);

    const before_proposal = allProposals[allProposals.length - 1]?.id ?? [];

    const result = await getListProposals({
      canisterId: governance_id,
      limit: sns_proposals_limit,
      include_status: filterStatus,
      before_proposal,
      exclude_type: excludeFuncIds,
      include_reward_status: [],
    });

    if (result && result.length > 0) {
      setAllProposals((prevState) => [...(prevState ?? []), ...result]);
      if (result.length < sns_proposals_limit) {
        setFetchDone(true);
      }
    } else {
      setFetchDone(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetch_proposals();
  }, [governance_id, filterStatus]);

  const handleProposalStatusFilter = (status: SnsProposalDecisionStatus[]) => {
    reset_state();
    setFilterStatus(status);
  };

  const handleSelectNeuronFuncs = (func_ids: bigint[], exclude_ids: bigint[]) => {
    reset_state();
    setExcludeFuncIds(exclude_ids);
  };

  return (
    <Wrapper>
      <Tabs />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "20px 0 0 0",
          gap: "10px 20px",
          flexWrap: "wrap",
        }}
      >
        <SelectSns value={root_id} onChange={handleSelectNeuronChange} />

        <SelectNeuronFuncs governance_id={governance_id} onConfirm={handleSelectNeuronFuncs} />

        <SelectNeuronProposalStatus governance_id={governance_id} onChange={handleProposalStatusFilter} />
      </Box>

      <Box sx={{ width: "100%", margin: "20px 0 0 0" }}>
        <InfiniteScroll
          style={{ width: "100%" }}
          dataLength={proposals?.length ?? 0}
          next={fetch_proposals}
          hasMore={!fetchDone}
          loader={null}
        >
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px",
              "@media(max-width: 940px)": {
                gridTemplateColumns: "1fr 1fr",
              },
              "@media(max-width: 640px)": {
                gridTemplateColumns: "1fr",
              },
            }}
          >
            {proposals?.map((proposal, index) => (
              <ProposalItem
                key={proposal.id[0]?.id ? proposal.id[0]?.id.toString() : `proposal_${index}`}
                proposal={proposal}
                governance_id={governance_id}
              />
            ))}
          </Box>
        </InfiniteScroll>
      </Box>

      {loading ? (
        <Box sx={{ margin: "20px 0 0 0" }}>
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
          </LoadingRow>
        </Box>
      ) : proposals && proposals.length === 0 ? (
        <Typography sx={{ margin: "20px 0 0 0" }}>No Proposals</Typography>
      ) : null}
    </Wrapper>
  );
}
