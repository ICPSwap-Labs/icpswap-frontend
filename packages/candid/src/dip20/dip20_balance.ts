import type { Principal } from "@icp-sdk/core/principal";

export default interface _SERVICE {
  balanceOf: (arg_0: Principal) => Promise<bigint>;
}
