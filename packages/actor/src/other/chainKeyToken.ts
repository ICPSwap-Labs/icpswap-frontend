import { Erc20MinterInterfaceFactory, Erc20MinterService } from "@icpswap/candid";
import { actor } from "../actor";

export const erc20Minter = (canisterId: string, identity?: true) =>
  actor.create<Erc20MinterService>({
    canisterId,
    idlFactory: Erc20MinterInterfaceFactory,
    identity,
  });
