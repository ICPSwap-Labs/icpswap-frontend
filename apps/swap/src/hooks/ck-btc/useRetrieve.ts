import { resultFormat, availableArgsNull } from "@icpswap/utils";
import { ckBtcMinter } from "actor/ckBTC";

export async function retrieveBTC(address: string, amount: bigint) {
  return resultFormat<{
    block_index: bigint;
  }>(
    await (
      await ckBtcMinter(true)
    ).retrieve_btc_with_approval({
      from_subaccount: availableArgsNull<number[]>(undefined),
      address,
      amount,
    }),
  );
}
