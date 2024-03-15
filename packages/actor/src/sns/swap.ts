import { SNS_SWAP_SERVICE, SNS_SWAP_INTERFACE_FACTORY } from "@icpswap/candid";
import { actor } from "../actor";

export const sns_swap = async (canisterId: string, identity?: true) =>
  actor.create<SNS_SWAP_SERVICE>({
    canisterId,
    idlFactory: SNS_SWAP_INTERFACE_FACTORY,
    identity,
  });
