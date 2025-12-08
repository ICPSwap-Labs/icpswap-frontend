import { PriceAlertsService, PriceAlertsFactory } from "@icpswap/candid";

import { ActorName } from "../ActorName";
import { actor } from "../actor";

export const priceAlerts = (identity?: true) =>
  actor.create<PriceAlertsService>({
    actorName: ActorName.PriceAlerts,
    idlFactory: PriceAlertsFactory,
    identity,
  });
