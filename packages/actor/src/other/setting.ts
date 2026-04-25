import { SettingInterfaceFactory, type SettingService } from "@icpswap/candid";

import { ActorName } from "../ActorName";
import { actor } from "../actor";

export const setting = () =>
  actor.create<SettingService>({
    actorName: ActorName.Setting,
    idlFactory: SettingInterfaceFactory,
  });
