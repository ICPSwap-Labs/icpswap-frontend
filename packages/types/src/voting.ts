export type CommitBatchArgs = {
  batch_id: bigint;
  content_type: string;
  chunk_ids: Array<bigint>;
};

export type {
  ProjectInfo,
  ProposalInfo,
  UserVoteRecord,
  ProposalCreateInfo,
  UserVotePowersInfo,
  VotingFileChunk,
} from "@icpswap/candid";
