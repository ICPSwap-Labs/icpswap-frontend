import { lazy } from "react";
import Loadable from "components/Loading/Loadable";

const NFTView = Loadable(lazy(() => import("../views/nft/View")));
const WalletNFTView = Loadable(lazy(() => import("../views/nft/WalletNFTView")));
const NFTCanisterDetails = Loadable(lazy(() => import("../views/nft/CanisterDetails")));
const NFTCollectMarket = Loadable(lazy(() => import("../views/nft/Collection")));
const NFTMarketCollections = Loadable(lazy(() => import("../views/nft/MarketplaceCollections")));

export const nftRoutesConfig = {
  NFT_MARKET_NFTS: "/marketplace/NFT/:canisterId",
  NFT_MARKET_COLLECTIONS: "/marketplace/collections",
  NFT_MARKET_VIEW: "/marketplace/NFT/view/:canisterId/:tokenId",
  NFT_VIEW: "/wallet/nft/view/:canisterId/:tokenId",
  NFT_CANISTER_DETAILS: "/wallet/nft/canister/details/:id",
};

export const nftRoutes = [
  { path: nftRoutesConfig.NFT_VIEW, getElement: () => <WalletNFTView /> },
  { path: nftRoutesConfig.NFT_CANISTER_DETAILS, getElement: () => <NFTCanisterDetails /> },
  { path: nftRoutesConfig.NFT_MARKET_NFTS, getElement: () => <NFTCollectMarket /> },
  { path: nftRoutesConfig.NFT_MARKET_VIEW, getElement: () => <NFTView /> },
  { path: nftRoutesConfig.NFT_MARKET_COLLECTIONS, getElement: () => <NFTMarketCollections /> },
];
