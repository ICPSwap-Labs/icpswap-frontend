import { TokenListInterfaceFactory, type TokenListService } from "@icpswap/candid";
import { ActorName } from "../ActorName";
import { actor } from "../actor";

export const tokenList = async (identity?: true) =>
  actor.create<TokenListService>({
    actorName: ActorName.TokenList,
    identity,
    idlFactory: TokenListInterfaceFactory,
  });
