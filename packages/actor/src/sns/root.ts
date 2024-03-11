import { SNS_ROOT_SERVE, SNS_INTERFACE_FACTORY } from "@icpswap/candid";
import { actor } from "../actor";

export const sns_root = async (canisterId: string) =>
  actor.create<SNS_ROOT_SERVE>({
    canisterId,
    idlFactory: SNS_INTERFACE_FACTORY,
  });
