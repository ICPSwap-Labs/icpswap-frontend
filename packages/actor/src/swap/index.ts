import { PassCodeManagerInterfaceFactory, type PassCodeManagerService } from "@icpswap/candid";
import { ActorName } from "../ActorName";
import { actor } from "../actor";

export const passCodeManager = async (identity?: true) =>
  actor.create<PassCodeManagerService>({
    identity,
    idlFactory: PassCodeManagerInterfaceFactory,
    actorName: ActorName.PassCodeManager,
  });

export * from "./global";
