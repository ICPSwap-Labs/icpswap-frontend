import { lazy } from "react";
import Loadable from "components/Loading/Loadable";
import i18n from "i18n";
import { RouteDefinition } from "./type";

const TokenClaimIndex = Loadable(lazy(() => import("../views/token-claim/index")));
const TokenClaimTransactions = Loadable(lazy(() => import("../views/token-claim/transactions")));
const CreateTokenClaim = Loadable(lazy(() => import("../views/token-claim/create")));

const StaticTitlesAndDescriptions = {
  Claim: i18n.t("title.claim"),
};

export const claimRoutesConfig = {
  CLAIM: "/token-claim",
  CLAIM_TRANSACTIONS: "/token-claim/transactions/:id",
  CLAIM_CREATE: "/token-claim/create",
};

export const claimRoutes: RouteDefinition[] = [
  {
    path: claimRoutesConfig.CLAIM,
    getElement: () => <TokenClaimIndex />,
    getTitle: () => StaticTitlesAndDescriptions.Claim,
  },
  {
    path: claimRoutesConfig.CLAIM_TRANSACTIONS,
    getElement: () => <TokenClaimTransactions />,
    getTitle: () => StaticTitlesAndDescriptions.Claim,
  },
  {
    path: claimRoutesConfig.CLAIM_CREATE,
    getElement: () => <CreateTokenClaim />,
    getTitle: () => StaticTitlesAndDescriptions.Claim,
  },
];
