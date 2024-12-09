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

export const infoRoutesConfigs = {
  INFO_OVERVIEW: "/info-overview",
  INFO_SWAP: "/info-swap",
  INFO_SWAP_POOLS: "/info-swap/pools",
  INFO_SWAP_POOL_DETAILS: "/info-swap/pool/details",
  INFO_SWAP_TOKEN_DETAILS: "/info-swap/token/details/:id",
  INFO_TOKENS: "/info-tokens",
  INFO_TOKENS_DETAILS: "/info-tokens/details/:id",
  INFO_TOKENS_HOLDERS: "/info-tokens/holders/:id",
  INFO_STAKE: "/info-stake",
  INFO_STAKE_DETAILS: "/info-stake/details/:id",
  INFO_FARM: "/info-farm",
  INFO_FARM_DETAILS: "/info-farm/details/:id",
  INFO_WRAP: "/info-wrap",
  INFO_CLAIM: "/info-claim",
  INFO_CLAIM_TRANSACTIONS: "/info-claim/transactions/:id",
  INFO_NFTS: "/info-nfts",
  INFO_NFTS_CANISTER: "/info-nfts/canister/:id",
  INFO_NFTS_INFO: "/info-nfts/info/:canisterId/:id",
  INFO_MARKETPLACE: "/info-marketplace",
  INFO_TOOLS: "/info-tools",
  INFO_TOOLS_BURN: "/info-tools/burn",
  INFO_TOOLS_VALUATION: "/info-tools/valuation",
  INFO_TOOLS_SWAP_TRANSACTIONS: "/info-tools/swap-transactions",
  INFO_TOOLS_POSITIONS: "/info-tools/positions",
  INFO_TOOLS_USER_BALANCES: "/info-tools/user-balances",
};

export const infoRoutes: { [path: string]: (props: any) => JSX.Element | any } = {
  [infoRoutesConfigs.INFO_OVERVIEW]: Overview,
  [infoRoutesConfigs.INFO_SWAP]: Swap,
  [infoRoutesConfigs.INFO_SWAP_POOLS]: SwapPools,
  "/info-swap/pool/details/:id": SwapPoolDetails,
  "/info-swap/token/details/:id": SwapTokenDetails,
  [infoRoutesConfigs.INFO_TOKENS]: Tokens,
  "/info-tokens/details/:id": TokenDetails,
  "/info-tokens/holders/:id": TokenHolders,
  [infoRoutesConfigs.INFO_STAKE]: Stake,
  "/info-stake/details/:id": StakeDetails,
  [infoRoutesConfigs.INFO_FARM]: Farm,
  "/info-farm/details/:id": FarmDetails,
  [infoRoutesConfigs.INFO_WRAP]: Wrap,
  [infoRoutesConfigs.INFO_CLAIM]: TokenClaim,
  "/info-claim/transactions/:id": TokenClaimTransactions,
  [infoRoutesConfigs.INFO_NFTS]: NFTs,
  "/info-nfts/canister/:id": NFTDetails,
  "/info-nfts/info/:canisterId/:id": NFTInfo,
  [infoRoutesConfigs.INFO_MARKETPLACE]: MarketPlace,
  [infoRoutesConfigs.INFO_TOOLS]: Tools,
  [infoRoutesConfigs.INFO_TOOLS_BURN]: ToolsBurn,
  [infoRoutesConfigs.INFO_TOOLS_VALUATION]: ToolsValuation,
  [infoRoutesConfigs.INFO_TOOLS_SWAP_TRANSACTIONS]: ToolsSwapTransactions,
  [infoRoutesConfigs.INFO_TOOLS_POSITIONS]: ToolsPositions,
  [infoRoutesConfigs.INFO_TOOLS_USER_BALANCES]: ToolsUserBalances,
};
