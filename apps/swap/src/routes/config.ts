import { lazy } from "react";
import Loadable from "components/Loading/Loadable";

import { infoRoutes } from "./info.config";

const Wallet = Loadable(lazy(() => import("../views/wallet/index")));

const Farms = Loadable(lazy(() => import("../views/staking-farm/index")));
const Farm = Loadable(lazy(() => import("../views/staking-farm/farm")));
const CreateFarm = Loadable(lazy(() => import("../views/staking-farm/create")));

const Staking = Loadable(lazy(() => import("../views/staking-token")));
const StakingDetails = Loadable(lazy(() => import("../views/staking-token/details")));
const StakingTokenCreate = Loadable(lazy(() => import("../views/staking-token/create")));

const Swap = Loadable(lazy(() => import("../views/swap-liquidity-v3/index")));
const SwapLimit = Loadable(lazy(() => import("../views/swap-liquidity-v3/limit")));
const SwapTransaction = Loadable(lazy(() => import("../views/swap-liquidity-v3/transaction")));
const SwapPro = Loadable(lazy(() => import("../views/swap-pro")));
const Liquidity = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/index")));
const AddLiquidity = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/AddLiquidity")));
const IncreaseLiquidity = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/IncreaseLiquidity")));
const DecreaseLiquidity = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/DecreaseLiquidity")));
const SwapReclaim = Loadable(lazy(() => import("../views/swap-liquidity-v3/reclaim/Reclaim")));
const SwapFindMisTransferToken = Loadable(lazy(() => import("../views/swap-liquidity-v3/MisTransferTokens")));
const SwapRevokeApprove = Loadable(lazy(() => import("../views/swap-liquidity-v3/RevokeApprove")));
const PCMReclaim = Loadable(lazy(() => import("../views/swap-liquidity-v3/PCMReclaim")));
const Position = Loadable(lazy(() => import("../views/swap-liquidity-v3/liquidity/Position")));

const NFTView = Loadable(lazy(() => import("../views/nft/View")));
const WalletNFTView = Loadable(lazy(() => import("../views/nft/WalletNFTView")));
const NFTMint = Loadable(lazy(() => import("../views/nft/Mint")));
const NFTCanisterList = Loadable(lazy(() => import("../views/nft/CanisterList")));
const NFTCanisterCreate = Loadable(lazy(() => import("../views/nft/CanisterCreate")));
const NFTCanisterDetails = Loadable(lazy(() => import("../views/nft/CanisterDetails")));

// const NFTMarket = Loadable(lazy(() => import("../views/nft")));
const NFTCollectMarket = Loadable(lazy(() => import("../views/nft/Collection")));
const NFTMarketCollections = Loadable(lazy(() => import("../views/nft/MarketplaceCollections")));

const Voting = Loadable(lazy(() => import("../views/voting/index")));
const VotingProject = Loadable(lazy(() => import("../views/voting/project")));
const VotingProposal = Loadable(lazy(() => import("../views/voting/proposal")));
const VotingCreateProposal = Loadable(lazy(() => import("../views/voting/create")));
const VoteCreateProject = Loadable(lazy(() => import("../views/voting/create-project")));

const TokenClaimIndex = Loadable(lazy(() => import("../views/token-claim/index")));
const TokenClaimTransactions = Loadable(lazy(() => import("../views/token-claim/transactions")));
const CreateTokenClaim = Loadable(lazy(() => import("../views/token-claim/create")));

const Wrap = Loadable(lazy(() => import("../views/swap-v2/wrap/index")));

const SNSLaunches = Loadable(lazy(() => import("../views/sns/Launchpad/Launches")));
const SNSLaunch = Loadable(lazy(() => import("../views/sns/Launchpad/Launch")));
const SnsNeurons = Loadable(lazy(() => import("../views/sns/Neurons/index")));
const SnsVotes = Loadable(lazy(() => import("../views/sns/Voting/index")));
const SnsVoting = Loadable(lazy(() => import("../views/sns/Voting/Voting")));

const CkBridge = Loadable(lazy(() => import("../views/ck-bridge")));

export const routeConfigs: { [path: string]: (props: any) => JSX.Element | any } = {
  "/wallet": Wallet,

  "/wallet/nft/view/:canisterId/:tokenId": WalletNFTView,
  "/wallet/nft/canister/details/:id": NFTCanisterDetails,

  "/stake": Staking,
  "/stake/details/:id": StakingDetails,
  "/stake/create": StakingTokenCreate,
  "/farm": Farms,
  "/farm/details/:id": Farm,
  "/farm/create": CreateFarm,

  "/swap": Swap,
  "/swap/limit": SwapLimit,
  "/swap/transaction": SwapTransaction,
  "/liquidity": Liquidity,
  "/liquidity/add/:currencyIdA?/:currencyIdB?/:feeAmount?": AddLiquidity,
  "/liquidity/decrease/:positionId/:pool": DecreaseLiquidity,
  "/liquidity/increase/:positionId/:pool": IncreaseLiquidity,
  "/liquidity/position/:positionId/:pool": Position,

  "/swap/withdraw": SwapReclaim,
  "/swap/find-mis-transferred-token": SwapFindMisTransferToken,
  "/swap/revoke-approve": SwapRevokeApprove,
  "/swap/pcm/reclaim": PCMReclaim,
  "/swap/pro": SwapPro,

  "/swap/v2/wrap": Wrap,

  // "/marketplace/NFT": NFTMarket,
  "/marketplace/NFT/:canisterId": NFTCollectMarket,
  "/marketplace/NFT/view/:canisterId/:tokenId": NFTView,
  "/marketplace/collections": NFTMarketCollections,

  "/voting": Voting,
  "/voting/:canisterId": VotingProject,
  "/voting/project/create": VoteCreateProject,

  "/voting/proposal/details/:canisterId/:id": VotingProposal,
  "/voting/proposal/create/:id": VotingCreateProposal,

  "/token-claim": TokenClaimIndex,
  "/token-claim/transactions/:id": TokenClaimTransactions,
  "/token-claim/create": CreateTokenClaim,

  "/info-tools/nft/canister/create": NFTCanisterCreate,
  "/info-tools/nft/mint": NFTMint,
  "/info-tools/nft/canister/list": NFTCanisterList,

  "/sns/neurons": SnsNeurons,
  "/sns/voting": SnsVotes,
  "/sns/voting/:governance_id/:proposal_id": SnsVoting,
  "/sns/launches": SNSLaunches,
  "/sns/launch/:root_id": SNSLaunch,

  "/ck-bridge": CkBridge,

  ...infoRoutes,
};
