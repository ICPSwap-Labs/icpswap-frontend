export type {
  ListDeployedSnsesResponse,
  ListSnsCanistersResponse,
  DeployedSns,
  GetLifecycleResponse,
  GetDerivedStateResponse,
  SwapSaleParameters,
  GetSaleParametersResponse,
  GetInitResponse,
  SNSSwapInitArgs,
  GetBuyerStateResponse,
  BuyerState,
  RefreshBuyerTokensResponse,
  Neuron,
  NeuronId,
  GetNeuron,
  GetNeuronResponse,
  ListNeurons,
  ListNeuronsResponse,
  DissolveState,
  NervousSystemParameters,
  DefaultFollowees,
  NeuronParameters,
  NeuronPermissionList,
  ManageNeuronResponse,
  Operation,
  ListNervousSystemFunctionsResponse,
  NervousSystemFunction,
  ListProposals,
  ListProposalsResponse,
  Proposal,
  ProposalId,
  GetProposalResponse,
  ProposalData,
  SnsBallot,
  SnsFunctionType,
  NeuronPermission,
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
