import {
  ChainKeyMinterInterfaceFactory,
  type ChainKeyMinterService,
  ckBTCMintFactory,
  type ckBTCMintService,
  DogeMinterFactory,
  type DogeMinterService,
} from "@icpswap/candid";
import { ckBTC_ID, ckBTC_MINTER_ID, DOGE_MINTER_ID } from "@icpswap/constants";
import { actor } from "../actor";
import { icrc2 } from "../token/index";

export const chainKeyETHMinter = (canisterId: string, identity?: true) =>
  actor.create<ChainKeyMinterService>({
    canisterId,
    idlFactory: ChainKeyMinterInterfaceFactory,
    identity,
  });

export const ckBtcMinter = (identity?: true) => {
  return actor.create<ckBTCMintService>({
    canisterId: ckBTC_MINTER_ID,
    idlFactory: ckBTCMintFactory,
    identity,
  });
};

export const ckBtcActor = async (identity?: true) => {
  return await icrc2(ckBTC_ID, identity);
};

export const dogeMinter = (identity?: true) =>
  actor.create<DogeMinterService>({
    canisterId: DOGE_MINTER_ID,
    idlFactory: DogeMinterFactory,
    identity,
  });
