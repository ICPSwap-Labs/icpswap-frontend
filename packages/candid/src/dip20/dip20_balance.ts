import type { Principal } from "@dfinity/principal";

export default interface _SERVICE {
  balanceOf: (arg_0: Principal) => Promise<bigint>;
}
