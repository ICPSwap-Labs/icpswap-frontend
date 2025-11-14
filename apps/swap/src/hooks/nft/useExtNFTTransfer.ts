import { isValidPrincipal, resultFormat } from "@icpswap/utils";
import { ext_nft } from "@icpswap/actor";
import { Principal } from "@dfinity/principal";

export async function extNFTTransfer(canister: string, to: string, from: string, nftId: string) {
  return resultFormat<bigint>(
    await (
      await ext_nft(canister, true)
    ).transfer({
      to: isValidPrincipal(to) ? { principal: Principal.fromText(to) } : { address: to },
      token: nftId,
      notify: false,
      from: { principal: Principal.fromText(from) },
      memo: [],
      subaccount: [],
      amount: BigInt(1),
    }),
  );
}
