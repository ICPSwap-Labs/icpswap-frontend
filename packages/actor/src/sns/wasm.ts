import { SNS_WASM_SERVICE, SNS_WASM_INTERFACE_FACTORY } from "@icpswap/candid";
import { actor } from "../actor";

export const sns_wasm = async () =>
  actor.create<SNS_WASM_SERVICE>({
    canisterId: "qaa6y-5yaaa-aaaaa-aaafa-cai",
    idlFactory: SNS_WASM_INTERFACE_FACTORY,
  });
