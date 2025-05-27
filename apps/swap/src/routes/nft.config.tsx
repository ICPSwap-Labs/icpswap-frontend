import { lazy } from "react";
import Loadable from "components/Loading/Loadable";
import i18n from "i18n";
import { RouteDefinition } from "./type";

const NFTView = Loadable(lazy(() => import("../views/nft/View")));
const WalletNFTView = Loadable(lazy(() => import("../views/nft/WalletNFTView")));
const NFTCanisterDetails = Loadable(lazy(() => import("../views/nft/CanisterDetails")));
const NFTCollectMarket = Loadable(lazy(() => import("../views/nft/Collection")));
const NFTMarketCollections = Loadable(lazy(() => import("../views/nft/MarketplaceCollections")));

const StaticTitlesAndDescriptions = {
  NFT: i18n.t("title.nft"),
};

export const nftRoutesConfig = {
  NFT_MARKET_NFTS: "/marketplace/NFT/:canisterId",
  NFT_MARKET_COLLECTIONS: "/marketplace/collections",
  NFT_MARKET_VIEW: "/marketplace/NFT/view/:canisterId/:tokenId",
  NFT_VIEW: "/wallet/nft/view/:canisterId/:tokenId",
  NFT_CANISTER_DETAILS: "/wallet/nft/canister/details/:id",
};

export const nftRoutes: RouteDefinition[] = [
  {
    path: nftRoutesConfig.NFT_VIEW,
    getElement: () => <WalletNFTView />,
    getTitle: () => StaticTitlesAndDescriptions.NFT,
  },
  {
    path: nftRoutesConfig.NFT_CANISTER_DETAILS,
    getElement: () => <NFTCanisterDetails />,
    getTitle: () => StaticTitlesAndDescriptions.NFT,
  },
  {
    path: nftRoutesConfig.NFT_MARKET_NFTS,
    getElement: () => <NFTCollectMarket />,
    getTitle: () => StaticTitlesAndDescriptions.NFT,
  },
  {
    path: nftRoutesConfig.NFT_MARKET_VIEW,
    getElement: () => <NFTView />,
    getTitle: () => StaticTitlesAndDescriptions.NFT,
  },
  {
    path: nftRoutesConfig.NFT_MARKET_COLLECTIONS,
    getElement: () => <NFTMarketCollections />,
    getTitle: () => StaticTitlesAndDescriptions.NFT,
  },
];
