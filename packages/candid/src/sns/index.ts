export type {
  _SERVICE as SNS_ROOT_SERVE,
  ListSnsCanistersResponse,
} from "./root";
export { idlFactory as SNS_INTERFACE_FACTORY } from "./root.did";

export type {
  _SERVICE as SNS_WASM_SERVICE,
  DeployedSns,
  ListDeployedSnsesResponse,
} from "./wasm";
export { idlFactory as SNS_WASM_INTERFACE_FACTORY } from "./wasm.did";
