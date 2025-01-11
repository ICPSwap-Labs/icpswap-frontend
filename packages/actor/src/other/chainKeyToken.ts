import { ChainKeyMinterInterfaceFactory, ChainKeyMinterService } from "@icpswap/candid";
import { actor } from "../actor";

export const chainKeyETHMinter = (canisterId: string, identity?: true) =>
  actor.create<ChainKeyMinterService>({
    canisterId,
    idlFactory: ChainKeyMinterInterfaceFactory,
    identity,
  });
