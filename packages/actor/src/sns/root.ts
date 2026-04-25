import { SNS_INTERFACE_FACTORY, type SNS_ROOT_SERVE } from "@icpswap/candid";
import { actor } from "../actor";

export const sns_root = async (canisterId: string) =>
  actor.create<SNS_ROOT_SERVE>({
    canisterId,
    idlFactory: SNS_INTERFACE_FACTORY,
  });
