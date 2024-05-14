import { ActorIdentity } from "@icpswap/types";
import {
  TokenPool,
  StakingPoolController,
  StakingPoolControllerInterfaceFactory,
  TokenPoolInterfaceFactory,
  V1TokenPool,
  V1TokenPoolInterfaceFactory,
  V1TokenPoolController,
  V1TokenPoolControllerInterfaceFactory,
  V1TokenPoolStorage,
  V1TokenPoolStorageInterfaceFactory,
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

/* v1 staking token pool */
export const v1StakingTokenController = (identity?: ActorIdentity) =>
  actor.create<V1TokenPoolController>({
    actorName: ActorName.V1TokenPoolController,
    identity,
    idlFactory: V1TokenPoolControllerInterfaceFactory,
  });

export const v1StakingToken = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<V1TokenPool>({
    canisterId,
    actorName: ActorName.V1TokenPool,
    identity,
    idlFactory: V1TokenPoolInterfaceFactory,
  });

export const v1StakingTokenStorage = (canisterId, identity?: ActorIdentity) =>
  actor.create<V1TokenPoolStorage>({
    actorName: ActorName.V1TokenPoolStorage,
    canisterId,
    identity,
    idlFactory: V1TokenPoolStorageInterfaceFactory,
  });
/* v1 staking token pool */
