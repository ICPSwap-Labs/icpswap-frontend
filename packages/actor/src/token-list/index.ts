import { TokenListService, TokenListInterfaceFactory } from "@icpswap/candid";
import { actor } from "../actor";
import { ActorName } from "../ActorName";

export const tokenList = async (identity?: true) =>
  actor.create<TokenListService>({
    actorName: ActorName.TokenList,
    identity,
    idlFactory: TokenListInterfaceFactory,
  });
