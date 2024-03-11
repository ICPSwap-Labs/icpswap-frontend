import { resultFormat, availableArgsNull } from "@icpswap/utils";
import { ckBTCMinterActor } from "actor/ckBTC";
import { getActorIdentity } from "components/Identity";

export async function retrieveBTC(address: string, amount: bigint) {
  const identity = await getActorIdentity();

  return resultFormat<{
    block_index: bigint;
  }>(
    await (
      await ckBTCMinterActor(identity)
    ).retrieve_btc_with_approval({
      from_subaccount: availableArgsNull<number[]>(undefined),
      address,
      amount,
    }),
  );
}

export async function retrieveBTCv1(address: string, amount: bigint) {
  const identity = await getActorIdentity();

  return resultFormat<{
    block_index: bigint;
  }>(
    await (
      await ckBTCMinterActor(identity)
    ).retrieve_btc({
      address,
      amount,
    }),
  );
}
