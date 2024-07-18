import { lazy } from "react";
import Loadable from "ui-component/Loading/Loadable";

const Swap = Loadable(lazy(() => import("../views/swap/index")));
const SwapPool = Loadable(lazy(() => import("../views/swap-pools/index")));
const SwapPoolDetails = Loadable(lazy(() => import("../views/swap-pools/details")));
const SwapToken = Loadable(lazy(() => import("../views/swap-tokens/index")));
const SwapTokenDetails = Loadable(lazy(() => import("../views/swap-tokens/details")));

const V2Swap = Loadable(lazy(() => import("../views/swap-v2/index")));
const V2SwapPools = Loadable(lazy(() => import("../views/swap-pools-v2/index")));
const V2SwapPoolDetails = Loadable(lazy(() => import("../views/swap-pools-v2/details")));
const V2SwapTokens = Loadable(lazy(() => import("../views/swap-tokens-v2/index")));
const V2SwapTokenDetails = Loadable(lazy(() => import("../views/swap-tokens-v2/details")));

const NFTCanisterList = Loadable(lazy(() => import("../views/nft/CanisterList")));
const NFTCanisterDetails = Loadable(lazy(() => import("../views/nft/CanisterDetails")));
const NFTView = Loadable(lazy(() => import("../views/nft/View")));
const NFTMarket = Loadable(lazy(() => import("../views/marketplace/index")));

const Overview = Loadable(lazy(() => import("../views/overview")));
const Wrap = Loadable(lazy(() => import("../views/wrap")));
const TokenList = Loadable(lazy(() => import("../views/token-list")));
const TokenDetail = Loadable(lazy(() => import("../views/token-list/Details")));

const Farms = Loadable(lazy(() => import("views/staking-farm/index")));
const FarmsDetails = Loadable(lazy(() => import("views/staking-farm/Details")));
const StakingToken = Loadable(lazy(() => import("views/staking-token/index")));
const StakingTokenDetails = Loadable(lazy(() => import("views/staking-token/Details")));
const V1StakingTokenDetails = Loadable(lazy(() => import("views/staking-token/v1/Details")));

const TokenTransactions = Loadable(lazy(() => import("../views/token-list/Transactions")));
const UserTokenTransactions = Loadable(lazy(() => import("../views/token-list/UserTransactions")));
const TokenHolders = Loadable(lazy(() => import("../views/token-list/Holders")));

const TokenClaim = Loadable(lazy(() => import("../views/token-claim/index")));
const TokenClaimTransactions = Loadable(lazy(() => import("../views/token-claim/transactions")));

const SwapScanTransactions = Loadable(lazy(() => import("../views/swap-scan/SwapTransactions")));
const SwapScanPositions = Loadable(lazy(() => import("../views/swap-scan/Positions")));
const SwapScanReclaims = Loadable(lazy(() => import("../views/swap-scan/Reclaim")));
const SwapScanValuation = Loadable(lazy(() => import("../views/swap-scan/AddressValuation")));

export const routesConfig: { [path: string]: (props: any) => JSX.Element } = {
  "/": Overview,
  "/wrap": Wrap,

  "/token/list": TokenList,
  "/token/details/:canisterId": TokenDetail,
  "/token/holders/:canisterId": TokenHolders,
  "/token/transactions/:canisterId": TokenTransactions,
  "/token/transactions/:canisterId/:account": UserTokenTransactions,

  "/swap": Swap,
  "/swap/pool": SwapPool,
  "/swap/pool/details/:canisterId": SwapPoolDetails,
  "/swap/token": SwapToken,
  "/swap/token/details/:canisterId": SwapTokenDetails,

  "/swap/v2": V2Swap,
  "/swap/v2/pool": V2SwapPools,
  "/swap/v2/pool/details/:canisterId": V2SwapPoolDetails,
  "/swap/v2/token": V2SwapTokens,
  "/swap/v2/token/details/:canisterId": V2SwapTokenDetails,

  "/nft/canisters": NFTCanisterList,
  "/nft/canister/details/:id": NFTCanisterDetails,
  "/nft/view/:canisterId/:tokenId": NFTView,

  "/stake": StakingToken,
  "/stake/details/:poolId": StakingTokenDetails,
  "/stake-v1/details/:poolId/:state": V1StakingTokenDetails,
  "/farm": Farms,
  "/farm/details/:farmId": FarmsDetails,
  "/marketplace": NFTMarket,
  "/token-claim": TokenClaim,
  "/token-claim/transactions/:id": TokenClaimTransactions,
  "/swap-scan/transactions": SwapScanTransactions,
  "/swap-scan/positions": SwapScanPositions,
  "/swap-scan/reclaims": SwapScanReclaims,
  "/swap-scan/valuation": SwapScanValuation,
};
