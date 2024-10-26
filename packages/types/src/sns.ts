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

// To be continued
export type SnsTokensInfo = {
  index: number;
  canister_ids: {
    governance_canister_id: string;
    index_canister_id: string;
    ledger_canister_id: string;
    root_canister_id: string;
    swap_canister_id: string;
  };
  lifecycle: {
    decentralization_sale_open_timestamp_seconds: number | null;
    lifecycle: number;
  };
  list_sns_canisters: {
    governance: string;
    index: string;
    ledger: string;
    root: string;
    swap: string;
  };
  meta: {
    description: string;
    logo: string;
    name: string;
    url: string;
  };
};
