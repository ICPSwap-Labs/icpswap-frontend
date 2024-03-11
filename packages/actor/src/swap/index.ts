import {
  PassCodeManagerService,
  PassCodeManagerInterfaceFactory,
} from "@icpswap/candid";
import { actor } from "../actor";
import { ActorName } from "../ActorName";

export const passCodeManager = async (identity?: true) =>
  actor.create<PassCodeManagerService>({
    identity,
    idlFactory: PassCodeManagerInterfaceFactory,
    actorName: ActorName.PassCodeManager,
  });

export * from "./global";
