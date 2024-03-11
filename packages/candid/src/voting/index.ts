export { idlFactory as VoteControllerInterfaceFactory } from "./VoteController.did";
export type { _SERVICE as VoteController, ProjectInfo } from "./VoteController";

export { idlFactory as VoteFileInterfaceFactory } from "./FileCanister.did";
export type {
  _SERVICE as VoteFile,
  Chunk as VotingFileChunk,
} from "./FileCanister";

export { idlFactory as VoteProjectInterfaceFactory } from "./VoteProjectCanister.did";
export type {
  _SERVICE as VoteProject,
  ProposalInfo,
  UserVoteRecord,
  UserVotePowersInfo,
  ProposalCreateInfo,
} from "./VoteProjectCanister";
