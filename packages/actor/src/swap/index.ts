import {
  PassCodeManagerService,
  PassCodeManagerInterfaceFactory,
  LimitTransactionService,
  LimitTransactionInterfaceFactory,
} from "@icpswap/candid";
import { actor } from "../actor";
import { ActorName } from "../ActorName";

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
