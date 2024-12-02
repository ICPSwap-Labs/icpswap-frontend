import { lazy } from "react";
import Loadable from "components/Loading/Loadable";

const Overview = Loadable(lazy(() => import("../views/info/overview")));
const Swap = Loadable(lazy(() => import("../views/info/swap")));
const SwapPools = Loadable(lazy(() => import("../views/info/swap/swap-pools")));
const SwapPoolDetails = Loadable(lazy(() => import("../views/info/swap/swap-pools/details")));
const SwapTokenDetails = Loadable(lazy(() => import("../views/info/swap/swap-tokens/details")));
const Tokens = Loadable(lazy(() => import("../views/info/tokens")));
const TokenDetails = Loadable(lazy(() => import("../views/info/tokens/Details")));
const TokenHolders = Loadable(lazy(() => import("../views/info/tokens/Holders")));
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
const Tools = Loadable(lazy(() => import("../views/info/tools")));
const ToolsBurn = Loadable(lazy(() => import("../views/info/tools/burn")));
const ToolsValuation = Loadable(lazy(() => import("../views/info/tools/valuation")));
const ToolsSwapTransactions = Loadable(lazy(() => import("../views/info/tools/swap-transactions")));
const ToolsPositions = Loadable(lazy(() => import("../views/info/tools/positions")));
const ToolsUserBalances = Loadable(lazy(() => import("../views/info/tools/user-balances")));

export const infoRoutesConfigs: { [path: string]: (props: any) => JSX.Element | any } = {
  "/info-overview": Overview,
  "/info-swap": Swap,
  "/info-swap/pools": SwapPools,
  "/info-swap/pool/details/:id": SwapPoolDetails,
  "/info-swap/token/details/:id": SwapTokenDetails,
  "/info-tokens": Tokens,
  "/info-tokens/details/:id": TokenDetails,
  "/info-tokens/holders/:id": TokenHolders,
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
  "/info-tools": Tools,
  "/info-tools/burn": ToolsBurn,
  "/info-tools/valuation": ToolsValuation,
  "/info-tools/swap-transactions": ToolsSwapTransactions,
  "/info-tools/positions": ToolsPositions,
  "/info-tools/user-balances": ToolsUserBalances,
};
