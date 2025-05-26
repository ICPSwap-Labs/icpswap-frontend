import { lazy } from "react";
import Loadable from "components/Loading/Loadable";

const Voting = Loadable(lazy(() => import("../views/voting/index")));
const VotingProject = Loadable(lazy(() => import("../views/voting/project")));
const VotingProposal = Loadable(lazy(() => import("../views/voting/proposal")));
const VotingCreateProposal = Loadable(lazy(() => import("../views/voting/create")));
const VoteCreateProject = Loadable(lazy(() => import("../views/voting/create-project")));

export const votingRoutesConfig = {
  VOTING: "/voting",
  VOTING_CANISTER: "/voting/:canisterId",
  VOTING_CREATE: "/voting/project/create",
  VOTING_PROPOSAL_DETAILS: "/voting/proposal/details/:canisterId/:id",
  VOTING_PROPOSAL_CREATE: "/voting/proposal/create/:id",
};

export const votingRoutes = [
  { path: votingRoutesConfig.VOTING, getElement: () => <Voting /> },
  { path: votingRoutesConfig.VOTING_CANISTER, getElement: () => <VotingProject /> },
  { path: votingRoutesConfig.VOTING_CREATE, getElement: () => <VoteCreateProject /> },
  { path: votingRoutesConfig.VOTING_PROPOSAL_DETAILS, getElement: () => <VotingProposal /> },
  { path: votingRoutesConfig.VOTING_PROPOSAL_CREATE, getElement: () => <VotingCreateProposal /> },
];
