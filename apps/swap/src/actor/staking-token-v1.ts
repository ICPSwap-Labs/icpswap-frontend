import { actor } from "@icpswap/actor";
import { _SERVICE } from "types/staking-token-v1/TokenPool";
import { idlFactory } from "types/staking-token-v1/TokenPool.did";

import { _SERVICE as TokenPoolController } from "types/staking-token-v1/TokenPoolController";
import { idlFactory as TokenPoolControllerInterfaceFactory } from "types/staking-token-v1/TokenPoolController.did";

export const stakingToken = (canisterId: string, identity?: true) =>
  actor.create<_SERVICE>({
    canisterId,
    identity,
    idlFactory,
  });

export const stakingTokenController = (identity?: true) =>
  actor.create<TokenPoolController>({
    canisterId: "o5xzb-ryaaa-aaaak-aejmq-cai",
    identity,
    idlFactory: TokenPoolControllerInterfaceFactory,
  });
