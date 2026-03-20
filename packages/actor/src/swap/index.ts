import {
  LimitTransactionInterfaceFactory,
  type LimitTransactionService,
  PassCodeManagerInterfaceFactory,
  type PassCodeManagerService,
} from "@icpswap/candid";
import { ActorName } from "../ActorName";
import { actor } from "../actor";

export const passCodeManager = async (identity?: true) =>
  actor.create<PassCodeManagerService>({
    identity,
    idlFactory: PassCodeManagerInterfaceFactory,
    actorName: ActorName.PassCodeManager,
  });

export const limitTransaction = async () =>
  actor.create<LimitTransactionService>({
    idlFactory: LimitTransactionInterfaceFactory,
    actorName: ActorName.LimitTransaction,
  });

export * from "./global";
