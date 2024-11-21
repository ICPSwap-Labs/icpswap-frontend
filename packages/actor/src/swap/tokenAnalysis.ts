import { TokenAnalysisService, TokenAnalysisFactory } from "@icpswap/candid";

import { actor } from "../actor";
import { ActorName } from "../ActorName";

export const tokenAnalysis = async () =>
  actor.create<TokenAnalysisService>({
    idlFactory: TokenAnalysisFactory,
    actorName: ActorName.TokenAnalysis,
  });
