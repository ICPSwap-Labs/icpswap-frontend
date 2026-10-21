import { secondsToDuration } from "@dfinity/utils";
import { SnsProposalDecisionStatus } from "@icpswap/constants";
import { getListProposals, useParsedQueryString } from "@icpswap/hooks";
import type { ProposalData } from "@icpswap/types";
import { nowInSeconds, shortenString } from "@icpswap/utils";
import { Link, LoadingRow, Wrapper } from "components/index";
import { Box, Typography } from "components/Mui";
import { SelectNeuronFuncs } from "components/sns/SelectNeuronFuncs";
import { SelectNeuronProposalStatus } from "components/sns/SelectNeuronProposalStatus";
import { SelectSns } from "components/sns/SelectSNSTokens";
import { Tabs } from "components/sns/Tab";
import { DEFAULT_ROOT_ID } from "constants/nns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { useStateSnsAllTokensInfo } from "store/sns/hooks";
import { getProposalStatus } from "utils/sns/proposal.utils";
import { getNnsGovernanceId, getNnsLedgerId, nnsEqualToRootId } from "utils/sns/utils";

interface ProposalItemProps {
  proposal: ProposalData;
  governance_id: string | undefined;
  latest_id: bigint | undefined;
}

const proposalStatusColors: Partial<Record<SnsProposalDecisionStatus, string>> = {
  [SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_OPEN]: "var(--color-primary)",
  [SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_ADOPTED]: "var(--color-success)",
  [SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_EXECUTED]: "var(--color-success)",
  [SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_FAILED]: "var(--color-error)",
  [SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_REJECTED]: "var(--color-error)",
};

function ProposalItem({ proposal, governance_id, latest_id }: ProposalItemProps) {
  const { t } = useTranslation();

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
  }, [proposal, t]);

  const proposalStatus = getProposalStatus(proposal);
  const statusColor =
    (proposalStatus === undefined ? undefined : proposalStatusColors[proposalStatus]) ?? "var(--color-base-content)";

  return (
    <Box
      className="card border border-base-300 bg-base-100"
      sx={{
        borderRadius: "18px",
        padding: "24px",
        cursor: "pointer",
        minHeight: "240px",
        transition: "border-color 180ms ease, box-shadow 180ms ease",
        "&:hover, &:focus-within": {
          borderColor: "color-mix(in oklab, var(--color-primary) 45%, var(--color-base-300))",
          boxShadow: "0 12px 32px -20px color-mix(in oklab, var(--color-primary) 25%, transparent)",
        },
        "@media(max-width: 640px)": {
          padding: "20px",
          minHeight: "auto",
        },
        "@media(prefers-reduced-motion: reduce)": {
          transition: "none",
        },
      }}
    >
      <Link
        to={`/sns/voting/${governance_id}/${proposal_id}${latest_id ? `?latest_id=${latest_id}` : ""}`}
        width="100%"
        height="100%"
        display="block"
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
          <Typography sx={{ fontSize: "12px", fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em" }}>
            ID: {proposal.id[0]?.id.toString() ?? "--"}
          </Typography>

          <Box
            className="badge badge-soft"
            sx={{
              height: "26px",
              padding: "4px 9px",
              gap: "6px",
              borderRadius: "7px",
              color: statusColor,
              border: `1px solid color-mix(in oklab, ${statusColor} 18%, transparent)`,
              background: `color-mix(in oklab, ${statusColor} 9%, transparent)`,
            }}
          >
            <Box
              component="span"
              aria-hidden
              sx={{ width: "5px", height: "5px", borderRadius: "50%", background: "currentColor" }}
            />
            <Typography sx={{ color: "inherit", fontSize: "11px", fontWeight: 500 }}>{proposal_status_text}</Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            color: "text.primary",
            fontWeight: 600,
            fontSize: "15px",
            letterSpacing: "-0.02em",
            wordBreak: "break-word",
            lineHeight: "23px",
            margin: "20px 0 0 0",
          }}
        >
          {title}
        </Typography>

        <Typography sx={{ margin: "10px 0 0 0", fontSize: "12px", wordBreak: "break-word", lineHeight: "20px" }}>
          {summary ? shortenString(summary, 150) : "--"}
        </Typography>

        {isExecuted ? null : (
          <Typography
            sx={{
              margin: "20px 0 0 0",
              paddingTop: "14px",
              borderTop: "1px solid var(--color-base-300)",
              fontSize: "11px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {seconds ? secondsToDuration({ seconds }) : "--"}
          </Typography>
        )}
      </Link>
    </Box>
  );
}

const sns_proposals_limit = 50;

export default function Votes() {
  const navigate = useNavigate();
  const { root_id: root_id_url } = useParsedQueryString() as { root_id: string };
  const [loading, setLoading] = useState(false);
  const [fetchDone, setFetchDone] = useState(false);
  const [allProposals, setAllProposals] = useState<ProposalData[]>([]);
  const [filterStatus, setFilterStatus] = useState<SnsProposalDecisionStatus[]>([]);
  const [excludeFuncIds, setExcludeFuncIds] = useState<bigint[]>([]);

  const root_id = useMemo(() => {
    return root_id_url ?? DEFAULT_ROOT_ID;
  }, [root_id_url]);

  const allNns = useStateSnsAllTokensInfo();

  const sns = useMemo(() => {
    if (!root_id || !allNns) return undefined;
    return allNns.find((nns) => nnsEqualToRootId(nns, root_id));
  }, [allNns, root_id]);

  const { governance_id } = useMemo(() => {
    if (!sns) return { governance_id: undefined, ledger_id: undefined };

    const governance_canister_id = getNnsGovernanceId(sns);
    const ledger_canister_id = getNnsLedgerId(sns);

    return { governance_id: governance_canister_id?.toString(), ledger_id: ledger_canister_id?.toString() };
  }, [sns]);

  const reset_state = () => {
    setFilterStatus([]);
    setFetchDone(false);
    setAllProposals([]);
  };

  const handleSelectNeuronChange = (id: string) => {
    reset_state();
    navigate(`/sns/voting?root_id=${id}`);
  };

  const proposals = useMemo(() => {
    if (!allProposals) return undefined;
    return [...allProposals];
  }, [allProposals]);

  const fetch_proposals = useCallback(async () => {
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
  }, [fetchDone, loading, governance_id, allProposals, filterStatus, excludeFuncIds]);

  useEffect(() => {
    fetch_proposals();
  }, [fetch_proposals]);

  const handleProposalStatusFilter = (status: SnsProposalDecisionStatus[]) => {
    reset_state();
    setFilterStatus(status);
  };

  const handleSelectNeuronFuncs = (_func_ids: bigint[], exclude_ids: bigint[]) => {
    reset_state();
    setExcludeFuncIds(exclude_ids);
  };

  return (
    <Wrapper>
      <Tabs />

      <Box
        className="rounded-2xl border border-base-300 bg-base-100"
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "24px 0 0 0",
          padding: "16px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <SelectSns value={root_id} onChange={handleSelectNeuronChange} />

        <SelectNeuronFuncs governance_id={governance_id} onConfirm={handleSelectNeuronFuncs} />

        <SelectNeuronProposalStatus governance_id={governance_id} onChange={handleProposalStatusFilter} />
      </Box>

      <Box sx={{ width: "100%", margin: "24px 0 0 0" }}>
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
              gap: "16px",
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
                latest_id={proposals ? proposals[0].id[0]?.id : undefined}
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
        <Typography
          className="rounded-2xl border border-dashed border-base-300 bg-base-100"
          sx={{ margin: "24px 0 0 0", padding: "56px 20px", textAlign: "center" }}
        >
          No Proposals
        </Typography>
      ) : null}
    </Wrapper>
  );
}
