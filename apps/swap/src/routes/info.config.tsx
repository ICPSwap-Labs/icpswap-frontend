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
const ToolsLockedPositions = Loadable(lazy(() => import("../views/info/tools/locked-positions")));
const ToolsPositionTransactions = Loadable(lazy(() => import("../views/info/tools/position-transactions")));

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
  INFO_TOOLS_LOCKED_POSITIONS: "/info-tools/locked-positions",
  INFO_TOOLS_POSITION_TRANSACTIONS: "/info-tools/position-transactions",
};

export const infoRoutes = [
  { path: infoRoutesConfigs.INFO_OVERVIEW, getElement: () => <Overview /> },
  { path: infoRoutesConfigs.INFO_SWAP, getElement: () => <Swap /> },
  { path: infoRoutesConfigs.INFO_SWAP_POOLS, getElement: () => <SwapPools /> },
  { path: "/info-swap/pool/details/:id", getElement: () => <SwapPoolDetails /> },
  { path: "/info-swap/token/details/:id", getElement: () => <SwapTokenDetails /> },
  { path: infoRoutesConfigs.INFO_TOKENS, getElement: () => <Tokens /> },
  { path: "/info-tokens/details/:id", getElement: () => <TokenDetails /> },
  { path: "/info-tokens/holders/:id", getElement: () => <TokenHolders /> },
  { path: infoRoutesConfigs.INFO_STAKE, getElement: () => <Stake /> },
  { path: "/info-stake/details/:id", getElement: () => <StakeDetails /> },
  { path: infoRoutesConfigs.INFO_FARM, getElement: () => <Farm /> },
  { path: "/info-farm/details/:id", getElement: () => <FarmDetails /> },
  { path: infoRoutesConfigs.INFO_WRAP, getElement: () => <Wrap /> },
  { path: infoRoutesConfigs.INFO_CLAIM, getElement: () => <TokenClaim /> },
  { path: "/info-claim/transactions/:id", getElement: () => <TokenClaimTransactions /> },
  { path: infoRoutesConfigs.INFO_NFTS, getElement: () => <NFTs /> },
  { path: "/info-nfts/canister/:id", getElement: () => <NFTDetails /> },
  { path: "/info-nfts/info/:canisterId/:id", getElement: () => <NFTInfo /> },
  { path: infoRoutesConfigs.INFO_MARKETPLACE, getElement: () => <MarketPlace /> },
  { path: infoRoutesConfigs.INFO_TOOLS, getElement: () => <Tools /> },
  { path: infoRoutesConfigs.INFO_TOOLS_BURN, getElement: () => <ToolsBurn /> },
  { path: infoRoutesConfigs.INFO_TOOLS_VALUATION, getElement: () => <ToolsValuation /> },
  { path: infoRoutesConfigs.INFO_TOOLS_SWAP_TRANSACTIONS, getElement: () => <ToolsSwapTransactions /> },
  { path: infoRoutesConfigs.INFO_TOOLS_POSITIONS, getElement: () => <ToolsPositions /> },
  { path: infoRoutesConfigs.INFO_TOOLS_USER_BALANCES, getElement: () => <ToolsUserBalances /> },
  { path: infoRoutesConfigs.INFO_TOOLS_LOCKED_POSITIONS, getElement: () => <ToolsLockedPositions /> },
  { path: infoRoutesConfigs.INFO_TOOLS_POSITION_TRANSACTIONS, getElement: () => <ToolsPositionTransactions /> },
];
