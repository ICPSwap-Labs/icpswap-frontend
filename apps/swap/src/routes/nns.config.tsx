import { lazy } from "react";
import Loadable from "components/Loading/Loadable";

const SNSLaunches = Loadable(lazy(() => import("../views/sns/Launchpad/Launches")));
const SNSLaunch = Loadable(lazy(() => import("../views/sns/Launchpad/Launch")));
const SnsNeurons = Loadable(lazy(() => import("../views/sns/Neurons/index")));
const SnsVotes = Loadable(lazy(() => import("../views/sns/Voting/index")));
const SnsVoting = Loadable(lazy(() => import("../views/sns/Voting/Voting")));

export const nnsRoutesConfig = {
  NNS_NEURONS: "/sns/neurons",
  NNS_VOTING: "/sns/voting",
  NNS_LAUNCHES: "/sns/launches",
  NNS_VOTING_PROPOSAL: "/sns/voting/:governance_id/:proposal_id",
  NNS_LAUNCH: "/sns/launch/:root_id",
};

export const nnsRoutes = [
  { path: nnsRoutesConfig.NNS_NEURONS, getElement: () => <SnsNeurons /> },
  { path: nnsRoutesConfig.NNS_VOTING, getElement: () => <SnsVotes /> },
  { path: nnsRoutesConfig.NNS_VOTING_PROPOSAL, getElement: () => <SnsVoting /> },
  { path: nnsRoutesConfig.NNS_LAUNCHES, getElement: () => <SNSLaunches /> },
  { path: nnsRoutesConfig.NNS_LAUNCH, getElement: () => <SNSLaunch /> },
];
