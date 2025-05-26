import { lazy } from "react";
import Loadable from "components/Loading/Loadable";

const TokenClaimIndex = Loadable(lazy(() => import("../views/token-claim/index")));
const TokenClaimTransactions = Loadable(lazy(() => import("../views/token-claim/transactions")));
const CreateTokenClaim = Loadable(lazy(() => import("../views/token-claim/create")));

export const claimRoutesConfig = {
  CLAIM: "/token-claim",
  CLAIM_TRANSACTIONS: "/token-claim/transactions/:id",
  CLAIM_CREATE: "/token-claim/create",
};

export const claimRoutes = [
  { path: claimRoutesConfig.CLAIM, getElement: () => <TokenClaimIndex /> },
  { path: claimRoutesConfig.CLAIM_TRANSACTIONS, getElement: () => <TokenClaimTransactions /> },
  { path: claimRoutesConfig.CLAIM_CREATE, getElement: () => <CreateTokenClaim /> },
];
