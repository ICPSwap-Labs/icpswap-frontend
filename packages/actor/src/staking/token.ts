import {
  type StakeIndex,
  StakeIndexInterfaceFactor,
  type StakingPoolController,
  StakingPoolControllerInterfaceFactory,
  type TokenPool,
  TokenPoolInterfaceFactory,
} from "@icpswap/candid";
import type { ActorIdentity } from "@icpswap/types";
import { ActorName } from "../ActorName";
import { actor } from "../actor";

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
