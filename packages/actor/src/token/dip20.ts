import {
  type DIP20,
  type DIP20Balance,
  DIP20BalanceInterfaceFactory,
  DIP20InterfaceFactory,
  type DIP20Supply,
  DIP20SupplyInterfaceFactory,
  type XTC,
  XTCInterfaceFactory,
} from "@icpswap/candid";
import type { ActorIdentity } from "@icpswap/types";
import { actor } from "../actor";

export const xtc = (identity?: ActorIdentity) =>
  actor.create<XTC>({
    identity,
    idlFactory: XTCInterfaceFactory,
    canisterId: "aanaa-xaaaa-aaaah-aaeiq-cai",
  });

export const dip20 = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<DIP20>({
    identity,
    idlFactory: DIP20InterfaceFactory,
    canisterId,
  });

export const dip20BalanceActor = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<DIP20Balance>({
    identity,
    idlFactory: DIP20BalanceInterfaceFactory,
    canisterId,
  });

export const dip20SupplyActor = (canisterId: string, identity?: ActorIdentity) =>
  actor.create<DIP20Supply>({
    identity,
    idlFactory: DIP20SupplyInterfaceFactory,
    canisterId,
  });
