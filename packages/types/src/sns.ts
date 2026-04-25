export type {
  BuyerState,
  DefaultFollowees,
  DeployedSns,
  DissolveState,
  GetBuyerStateResponse,
  GetDerivedStateResponse,
  GetInitResponse,
  GetLifecycleResponse,
  GetNeuron,
  GetNeuronResponse,
  GetProposalResponse,
  GetSaleParametersResponse,
  ListDeployedSnsesResponse,
  ListNervousSystemFunctionsResponse,
  ListNeurons,
  ListNeuronsResponse,
  ListProposals,
  ListProposalsResponse,
  ListSnsCanistersResponse,
  ManageNeuronResponse,
  NervousSystemFunction,
  NervousSystemParameters,
  Neuron,
  NeuronId,
  NeuronParameters,
  NeuronPermission,
  NeuronPermissionList,
  Operation,
  Proposal,
  ProposalData,
  ProposalId,
  RefreshBuyerTokensResponse,
  SNSSwapInitArgs,
  SnsBallot,
  SnsFunctionType,
  SwapSaleParameters,
} from "@icpswap/candid";

export interface TokenRoots {
  description: string;
  enabled: boolean;
  name: string;
  logo: string;
  root_canister_id: string;
  url: string;
  swap_lifecycle: {
    decentralization_sale_open_timestamp_seconds: number;
    lifecycle: "LIFECYCLE_COMMITTED" | "LIFECYCLE_OPEN" | "LIFECYCLE_ADOPTED";
  };
}

export type NnsTokenInfo = {
  index: number;
  list_sns_canisters: {
    root: string;
    swap: string;
    ledger: string;
    index: string;
    governance: string;
    dapps: string[];
    archives: string[];
  };
  meta: {
    url: string;
    name: string;
    description: string;
    logo: string;
  };
  lifecycle: {
    decentralization_sale_open_timestamp_seconds: string;
    lifecycle: string;
    decentralization_swap_termination_timestamp_seconds: string;
  };
};
