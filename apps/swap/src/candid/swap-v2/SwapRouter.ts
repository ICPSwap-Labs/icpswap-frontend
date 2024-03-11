import type { Principal } from "@dfinity/principal";
export type Address = string;
export type BoolResult = { ok: boolean } | { err: string };
export type NatResult = { ok: bigint } | { err: string };
export type ResponseResult = { ok: Array<string> } | { err: string };
export interface _SERVICE {
  addAdmin: (arg_0: string) => Promise<BoolResult>;
  cycleAvailable: () => Promise<NatResult>;
  cycleBalance: () => Promise<NatResult>;
  exactInput: (arg_0: Address, arg_1: Principal, arg_2: bigint, arg_3: string, arg_4: string) => Promise<NatResult>;
  exactInputSingle: (
    arg_0: Address,
    arg_1: Principal,
    arg_2: bigint,
    arg_3: string,
    arg_4: string,
    arg_5: string,
  ) => Promise<NatResult>;
  exactOutput: (arg_0: Address, arg_1: Principal, arg_2: bigint, arg_3: string, arg_4: string) => Promise<NatResult>;
  exactOutputSingle: (
    arg_0: Address,
    arg_1: Principal,
    arg_2: bigint,
    arg_3: string,
    arg_4: string,
    arg_5: string,
  ) => Promise<NatResult>;
  getAdminList: () => Promise<ResponseResult>;
  getUnitPrice: (arg_0: string, arg_1: string) => Promise<NatResult>;
  quoteExactInput: (arg_0: string, arg_1: string) => Promise<NatResult>;
  quoteExactInputSingle: (arg_0: string, arg_1: string, arg_2: string) => Promise<NatResult>;
  quoteExactOutput: (arg_0: string, arg_1: string) => Promise<NatResult>;
  removeAdmin: (arg_0: string) => Promise<BoolResult>;
  setBaseDataStructureCanister: (arg_0: string) => Promise<undefined>;
}
