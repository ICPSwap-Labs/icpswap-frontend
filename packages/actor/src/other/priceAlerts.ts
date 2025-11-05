import { PriceAlertsService, PriceAlertsFactory } from "@icpswap/candid";

import { ActorName } from "../ActorName";
import { actor } from "../actor";

export const priceAlerts = (identity?: true) =>
  actor.create<PriceAlertsService>({
    canisterId: ActorName.PriceAlerts,
    idlFactory: PriceAlertsFactory,
    identity,
  });
