import { sns_governance } from "@icpswap/actor";
import { useCallback } from "react";
import { optionalArg, resultFormat } from "@icpswap/utils";
import type { GetProposalResponse, ListProposalsResponse, ProposalData, ProposalId } from "@icpswap/types";
import { useCallsData } from "../useCallData";

export async function getProposal(canisterId: string, proposal_id: bigint) {
  const result = resultFormat<GetProposalResponse>(
    await (
      await sns_governance(canisterId)
    ).get_proposal({
      proposal_id: optionalArg<{ id: bigint }>({ id: proposal_id }),
    }),
  ).data?.result;

  if (!result) return undefined;

  const proposal: ProposalData | undefined = result[0]
    ? "Proposal" in result[0]
      ? result[0].Proposal
      : undefined
    : undefined;

  return proposal;
}

export function useProposal(governance_id: string | undefined, proposal_id: bigint | undefined, refresh?: number) {
  return useCallsData(
    useCallback(async () => {
      if (!governance_id || proposal_id === undefined) return undefined;
      return await getProposal(governance_id, proposal_id);
    }, [governance_id, proposal_id]),
    refresh,
  );
}

export interface GetListProposalsArgs {
  canisterId: string;
  include_reward_status: Int32Array | number[];
  limit: number;
  include_status: Int32Array | number[];
  exclude_type: BigUint64Array | bigint[];
  before_proposal: [] | [ProposalId];
}

export async function getListProposals({
  canisterId,
  include_reward_status,
  include_status,
  exclude_type,
  before_proposal,
  limit,
}: GetListProposalsArgs) {
  const result = resultFormat<ListProposalsResponse>(
    await (
      await sns_governance(canisterId)
    ).list_proposals({
      include_reward_status,
      before_proposal,
      limit,
      exclude_type,
      include_status,
    }),
  );

  return result.data?.proposals;
}

export interface UseListProposalsArgs {
  canisterId: string | undefined;
  include_reward_status: Int32Array | number[];
  limit: number;
  include_status: Int32Array | number[];
  exclude_type: BigUint64Array | bigint[];
  before_proposal: [] | [ProposalId];
  refresh?: number;
}

export function useListProposals({
  canisterId,
  limit,
  refresh,
  include_reward_status,
  include_status,
  exclude_type,
  before_proposal,
}: UseListProposalsArgs) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getListProposals({
        canisterId,
        include_status,
        include_reward_status,
        exclude_type,
        limit,
        before_proposal,
      });
    }, [canisterId, include_reward_status, limit, exclude_type, include_status, before_proposal]),
    refresh,
  );
}
