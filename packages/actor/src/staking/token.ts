import { ActorIdentity } from "@icpswap/types";
import {
  TokenPool,
  StakingPoolController,
  StakingPoolControllerInterfaceFactory,
  TokenPoolInterfaceFactory,
  StakeIndex,
  StakeIndexInterfaceFactor,
} from "@icpswap/candid";

import { actor } from "../actor";
import { ActorName } from "../ActorName";

export const stakingPoolController = (identity?: ActorIdentity) =>
  actor.create<StakingPoolController>({
    actorName: ActorName.StakingTokenController,
    identity,
    idlFactory: StakingPoolControllerInterfaceFactory,
  });

export const stakingPool = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<TokenPool>({
    canisterId,
    actorName: ActorName.TokenPool,
    identity,
    idlFactory: TokenPoolInterfaceFactory,
  });

export const stakeIndex = (identity?: ActorIdentity) =>
  actor.create<StakeIndex>({
    actorName: ActorName.StakeIndex,
    identity,
    idlFactory: StakeIndexInterfaceFactor,
  });
