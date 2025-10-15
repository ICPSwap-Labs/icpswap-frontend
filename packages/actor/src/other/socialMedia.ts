import { SocialMediaInterfaceFactory, SocialMediaService } from "@icpswap/candid";

import { ActorName } from "../ActorName";
import { actor } from "../actor";

export const socialMedia = () =>
  actor.create<SocialMediaService>({
    actorName: ActorName.SocialMedia,
    idlFactory: SocialMediaInterfaceFactory,
  });
