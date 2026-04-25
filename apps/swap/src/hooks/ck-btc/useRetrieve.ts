import { ckBtcMinter } from "@icpswap/actor";
import { optionalArg, resultFormat } from "@icpswap/utils";

export async function retrieveBTC(address: string, amount: bigint) {
  return resultFormat<{
    block_index: bigint;
  }>(
    await (await ckBtcMinter(true)).retrieve_btc_with_approval({
      from_subaccount: optionalArg<number[]>(undefined),
      address,
      amount,
    }),
  );
}
