import {
  TokenListService,
  TokenListInterfaceFactory,
  AllTokenOfSwapInterfaceFactory,
  AllTokenOfSwapService,
} from "@icpswap/candid";
import { actor } from "../actor";
import { ActorName } from "../ActorName";

export const tokenList = async (identity?: true) =>
  actor.create<TokenListService>({
    actorName: ActorName.TokenList,
    identity,
    idlFactory: TokenListInterfaceFactory,
  });

export const allTokenOfSwap = async () =>
  actor.create<AllTokenOfSwapService>({
    canisterId: "aofop-yyaaa-aaaag-qdiqa-cai",
    idlFactory: AllTokenOfSwapInterfaceFactory,
  });
