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
