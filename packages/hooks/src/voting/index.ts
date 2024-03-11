import { useCallback } from "react";
import {
  isAvailablePageArgs,
  availableArgsNull,
  resultFormat,
} from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { votingCanister, votingController, votingFile } from "@icpswap/actor";
import type { ActorIdentity, PaginationResult } from "@icpswap/types";
import type {
  ProjectInfo,
  ProposalInfo,
  UserVotePowersInfo,
  UserVoteRecord,
  VotingFileChunk,
  CommitBatchArgs,
  ProposalCreateInfo,
} from "@icpswap/types";
import { Principal } from "@dfinity/principal";

export async function createVotingCanister(
  identity: ActorIdentity,
  args: ProjectInfo
) {
  return resultFormat<boolean>(
    await (await votingController(identity)).create(args)
  );
}

export async function getVotingProjects(offset: number, limit: number) {
  return resultFormat<PaginationResult<ProjectInfo>>(
    await (
      await votingController()
    ).findProjectPage(BigInt(offset), BigInt(limit))
  ).data;
}

export function useVotingProjects(offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit)) return undefined;
      return await getVotingProjects(offset, limit);
    }, [offset, limit])
  );
}

export async function getVotingProjectDetails(canisterId: string) {
  return resultFormat<ProjectInfo>(
    await (await votingCanister(canisterId)).getProject()
  ).data;
}

export function useVotingProjectDetails(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getVotingProjectDetails(canisterId);
    }, [canisterId])
  );
}

export async function createVotingProposal(
  identity: ActorIdentity,
  canisterId: string,
  args: ProposalCreateInfo
) {
  return resultFormat<string>(
    await (await votingCanister(canisterId, identity)).create(args)
  );
}

export async function deleteVotingProposal(
  identity: ActorIdentity,
  canisterId: string,
  proposalId: string
) {
  return resultFormat<boolean>(
    await (
      await votingCanister(canisterId, identity)
    ).deleteProposal(proposalId)
  );
}

export async function getVotingProposal(
  canisterId: string,
  proposalId: string
) {
  return resultFormat<ProposalInfo>(
    await (await votingCanister(canisterId)).getProposal(proposalId)
  ).data;
}

export function useVotingProposal(
  canisterId: string | undefined,
  proposalId: string | undefined,
  reload?: boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !proposalId) return undefined;
      return await getVotingProposal(canisterId, proposalId);
    }, [proposalId, canisterId]),
    reload
  );
}

export async function getVotingProposals(
  canisterId: string,
  address: string | undefined,
  state: number | undefined,
  offset: number,
  limit: number
) {
  return resultFormat<PaginationResult<ProposalInfo>>(
    await (
      await votingCanister(canisterId)
    ).findPage(
      availableArgsNull<string>(address),
      availableArgsNull<bigint>(
        !!state || state === 0 ? BigInt(state) : undefined
      ),
      BigInt(offset),
      BigInt(limit)
    )
  ).data;
}

export function useVotingProposals(
  canisterId: string | undefined,
  address: string | undefined,
  state: number | undefined,
  offset: number,
  limit: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;

      return await getVotingProposals(
        canisterId,
        address,
        state,
        offset,
        limit
      );
    }, [canisterId, address, state, offset, limit])
  );
}

export async function setVotingProposalState(
  identity: ActorIdentity,
  canisterId: string,
  proposalId: string,
  state: number
) {
  return resultFormat<boolean>(
    await (
      await votingCanister(canisterId, identity)
    ).setState(proposalId, BigInt(state))
  );
}

export async function setVotingProposalPowers(
  identity: ActorIdentity,
  canisterId: string,
  proposalId: string,
  powers: UserVotePowersInfo[]
) {
  return resultFormat<boolean>(
    await (
      await votingCanister(canisterId, identity)
    ).setVotePower(proposalId, powers)
  );
}

export async function voting(
  identity: ActorIdentity,
  canisterId: string,
  proposalId: string,
  value: string,
  powers: number
) {
  return resultFormat<boolean>(
    await (
      await votingCanister(canisterId, identity)
    ).vote(proposalId, value, BigInt(powers))
  );
}

export async function getVotingTransactions(
  canisterId: string,
  proposalId: string,
  offset: number,
  limit: number
) {
  return resultFormat<PaginationResult<UserVoteRecord>>(
    await (
      await votingCanister(canisterId)
    ).findRecordPage(proposalId, BigInt(offset), BigInt(limit))
  ).data;
}

export function useVotingTransactions(
  canisterId: string | undefined,
  proposalId: string | undefined,
  offset: number,
  limit: number
) {
  return useCallsData(
    useCallback(async () => {
      if (!isAvailablePageArgs(offset, limit) || !canisterId || !proposalId)
        return undefined;

      return await getVotingTransactions(
        canisterId!,
        proposalId!,
        offset,
        limit
      );
    }, [offset, limit, proposalId, canisterId])
  );
}

export async function getUserVotingPowers(
  canisterId: string,
  proposalId: string | undefined,
  address: string | undefined,
  offset: number,
  limit: number
) {
  return resultFormat<PaginationResult<UserVotePowersInfo>>(
    await (
      await votingCanister(canisterId)
    ).findVotePower(
      availableArgsNull<string>(proposalId),
      availableArgsNull<string>(address),
      BigInt(offset),
      BigInt(limit)
    )
  ).data;
}

export function useUserVotingPowers(
  canisterId: string | undefined,
  proposalId: string | undefined,
  address: string | undefined,
  offset: number,
  limit: number,
  reload?: boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;

      return await getUserVotingPowers(
        canisterId!,
        proposalId,
        address,
        offset,
        limit
      );
    }, [canisterId, address, proposalId, offset, limit]),
    reload
  );
}

export async function addVotingAuthorityUsers(
  identity: ActorIdentity,
  canisterId: string,
  user: Principal
) {
  return resultFormat<boolean>(
    await (await votingCanister(canisterId, identity)).addAdmin(user)
  );
}

export async function deleteVotingAuthorityUsers(
  identity: ActorIdentity,
  canisterId: string,
  user: Principal
) {
  return resultFormat<boolean>(
    await (await votingCanister(canisterId, identity)).deleteAdmin(user)
  );
}

export async function getVotingAuthorityUsers(
  canisterId: string,
  offset: number,
  limit: number
) {
  return resultFormat<PaginationResult<Principal>>(
    await (
      await votingCanister(canisterId)
    ).getAdminList(BigInt(offset), BigInt(limit))
  ).data;
}

export function useVotingAuthorityUsers(
  canisterId: string | undefined,
  offset: number,
  limit: number,
  reload?: boolean
) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getVotingAuthorityUsers(canisterId!, offset, limit);
    }, [canisterId, offset, limit]),
    reload
  );
}

// -------------- Voting file --------------

export async function createVotingBatch(
  identity: ActorIdentity,
  canisterId: string,
  projectId: string
) {
  return resultFormat<{
    batch_id: bigint;
  }>(await (await votingFile(canisterId, identity)).create_batch(projectId));
}

export async function createVotingChunk(
  identity: ActorIdentity,
  canisterId: string,
  chunk: VotingFileChunk,
  projectId: string
) {
  return resultFormat<{
    chunk_id: bigint;
  }>(
    await (
      await votingFile(canisterId, identity)
    ).create_chunk(chunk, projectId)
  );
}

export async function commitVotingChunk(
  identity: ActorIdentity,
  canisterId: string,
  args: CommitBatchArgs,
  projectId: string
) {
  const result = await (
    await votingFile(canisterId, identity)
  ).commit_batch(args, projectId);

  return resultFormat<boolean>(result === undefined ? true : false);
}

// -------------- Voting file --------------
