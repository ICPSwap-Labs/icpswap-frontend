import { actor } from "./actor";
import { ActorName } from "./ActorName";
import { ActorIdentity } from "@icpswap/types";

import {
  VoteController,
  VoteControllerInterfaceFactory,
  VoteFile,
  VoteFileInterfaceFactory,
  VoteProject,
  VoteProjectInterfaceFactory,
} from "@icpswap/candid";

export const votingController = (identity?: ActorIdentity) =>
  actor.create<VoteController>({
    actorName: ActorName.VotingController,
    idlFactory: VoteControllerInterfaceFactory,
    identity,
  });

export const votingCanister = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<VoteProject>({
    canisterId,
    identity,
    idlFactory: VoteProjectInterfaceFactory,
  });

export const votingFile = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<VoteFile>({
    canisterId,
    identity,
    idlFactory: VoteFileInterfaceFactory,
  });
