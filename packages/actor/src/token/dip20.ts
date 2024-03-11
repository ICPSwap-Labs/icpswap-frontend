import { actor } from "../actor";
import { ActorIdentity } from "@icpswap/types";
import {
  DIP20,
  DIP20Balance,
  DIP20InterfaceFactory,
  DIP20BalanceInterfaceFactory,
  XTC,
  XTCInterfaceFactory,
  DIP20Supply,
  DIP20SupplyInterfaceFactory,
} from "@icpswap/candid";

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

export const dip20BalanceActor = (
  canisterId: string,
  identity?: ActorIdentity
) =>
  actor.create<DIP20Balance>({
    identity,
    idlFactory: DIP20BalanceInterfaceFactory,
    canisterId,
  });

export const dip20SupplyActor = (
  canisterId: string,
  identity?: ActorIdentity
) =>
  actor.create<DIP20Supply>({
    identity,
    idlFactory: DIP20SupplyInterfaceFactory,
    canisterId,
  });
