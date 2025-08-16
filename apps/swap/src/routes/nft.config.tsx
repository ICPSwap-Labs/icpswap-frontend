import { lazy } from "react";
import Loadable from "components/Loading/Loadable";
import i18n from "i18n";
import { RouteDefinition } from "./type";

const WalletNFTView = Loadable(lazy(() => import("../views/nft/WalletNFTView")));
const NFTCanisterDetails = Loadable(lazy(() => import("../views/nft/CanisterDetails")));

const StaticTitlesAndDescriptions = {
  NFT: i18n.t("title.nft"),
};

export const nftRoutesConfig = {
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
];
