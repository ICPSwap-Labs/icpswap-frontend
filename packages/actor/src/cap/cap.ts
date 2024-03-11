import { actor } from "../actor";

import {
  CAP,
  CapInterfaceFactory,
  CapRouter,
  CapRouterInterfaceFactory,
} from "@icpswap/candid";

export const cap = (canisterId: string) =>
  actor.create<CAP>({
    idlFactory: CapInterfaceFactory,
    canisterId,
  });

export const cap_router = () =>
  actor.create<CapRouter>({
    idlFactory: CapRouterInterfaceFactory,
    canisterId: "lj532-6iaaa-aaaah-qcc7a-cai",
  });
