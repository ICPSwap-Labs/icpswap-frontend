import {
  ChainKeyMinterInterfaceFactory,
  ChainKeyMinterService,
  ckBTCMintFactory,
  ckBTCMintService,
} from "@icpswap/candid";
import { actor } from "../actor";

export const chainKeyETHMinter = (canisterId: string, identity?: true) =>
  actor.create<ChainKeyMinterService>({
    canisterId,
    idlFactory: ChainKeyMinterInterfaceFactory,
    identity,
  });

export const ckBTCMinter = (canisterId: string, identity?: true) => {
  return actor.create<ckBTCMintService>({
    canisterId,
    idlFactory: ckBTCMintFactory,
    identity,
  });
};
