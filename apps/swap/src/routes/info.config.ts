import { lazy } from "react";
import Loadable from "components/Loading/Loadable";

const Overview = Loadable(lazy(() => import("../views/info/overview")));
const Swap = Loadable(lazy(() => import("../views/info/swap")));
const Tokens = Loadable(lazy(() => import("../views/info/tokens")));
const Stake = Loadable(lazy(() => import("../views/info/stake")));
const StakeDetails = Loadable(lazy(() => import("../views/info/stake/Details")));
const Farm = Loadable(lazy(() => import("../views/info/farm")));
const FarmDetails = Loadable(lazy(() => import("../views/info/farm/Details")));
const Wrap = Loadable(lazy(() => import("../views/info/wrap")));
const TokenClaim = Loadable(lazy(() => import("../views/info/token-claim")));
const TokenClaimTransactions = Loadable(lazy(() => import("../views/info/token-claim/transactions")));
const NFTs = Loadable(lazy(() => import("../views/info/nft/NFTs")));
const NFTDetails = Loadable(lazy(() => import("../views/info/nft/Details")));
const NFTInfo = Loadable(lazy(() => import("../views/info/nft/NFTInfo")));
const MarketPlace = Loadable(lazy(() => import("../views/info/marketplace")));

export const infoRoutesConfigs: { [path: string]: (props: any) => JSX.Element | any } = {
  "/info-overview": Overview,
  "/info-swap": Swap,
  "/info-tokens": Tokens,
  "/info-stake": Stake,
  "/info-stake/details/:id": StakeDetails,
  "/info-farm": Farm,
  "/info-farm/details/:id": FarmDetails,
  "/info-wrap": Wrap,
  "/info-claim": TokenClaim,
  "/info-claim/transactions/:id": TokenClaimTransactions,
  "/info-nfts": NFTs,
  "/info-nfts/canister/:id": NFTDetails,
  "/info-nfts/info/:canisterId/:id": NFTInfo,
  "/info-marketplace": MarketPlace,
};
