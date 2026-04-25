import type { Principal } from "@icpswap/dfinity";

export default interface _SERVICE {
  balanceOf: (arg_0: Principal) => Promise<bigint>;
}
