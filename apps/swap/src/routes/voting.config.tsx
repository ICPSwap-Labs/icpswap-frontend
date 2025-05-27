import { lazy } from "react";
import Loadable from "components/Loading/Loadable";
import i18n from "i18n";
import { RouteDefinition } from "./type";

const Voting = Loadable(lazy(() => import("../views/voting/index")));
const VotingProject = Loadable(lazy(() => import("../views/voting/project")));
const VotingProposal = Loadable(lazy(() => import("../views/voting/proposal")));
const VotingCreateProposal = Loadable(lazy(() => import("../views/voting/create")));
const VoteCreateProject = Loadable(lazy(() => import("../views/voting/create-project")));

const StaticTitlesAndDescriptions = {
  Voting: i18n.t("title.voting"),
};

export const votingRoutesConfig = {
  VOTING: "/voting",
  VOTING_CANISTER: "/voting/:canisterId",
  VOTING_CREATE: "/voting/project/create",
  VOTING_PROPOSAL_DETAILS: "/voting/proposal/details/:canisterId/:id",
  VOTING_PROPOSAL_CREATE: "/voting/proposal/create/:id",
};

export const votingRoutes: RouteDefinition[] = [
  { path: votingRoutesConfig.VOTING, getElement: () => <Voting />, getTitle: () => StaticTitlesAndDescriptions.Voting },
  {
    path: votingRoutesConfig.VOTING_CANISTER,
    getElement: () => <VotingProject />,
    getTitle: () => StaticTitlesAndDescriptions.Voting,
  },
  {
    path: votingRoutesConfig.VOTING_CREATE,
    getElement: () => <VoteCreateProject />,
    getTitle: () => StaticTitlesAndDescriptions.Voting,
  },
  {
    path: votingRoutesConfig.VOTING_PROPOSAL_DETAILS,
    getElement: () => <VotingProposal />,
    getTitle: () => StaticTitlesAndDescriptions.Voting,
  },
  {
    path: votingRoutesConfig.VOTING_PROPOSAL_CREATE,
    getElement: () => <VotingCreateProposal />,
    getTitle: () => StaticTitlesAndDescriptions.Voting,
  },
];
