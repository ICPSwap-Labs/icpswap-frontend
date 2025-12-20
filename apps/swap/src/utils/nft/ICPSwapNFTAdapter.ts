import type { NFTTransferArgs, NFTTransferResult, NFTAllowanceArgs, NFTApproveArgs } from "@icpswap/types";
import { resultFormat } from "@icpswap/utils";
import { NFTCanister } from "@icpswap/actor";

import { BaseNFTAdapter } from "./BaseNFTAdapter";

export class ICPSwapNFT extends BaseNFTAdapter {
  public async transfer({ canisterId, params }: { canisterId: string; params: NFTTransferArgs }) {
    return resultFormat<NFTTransferResult>(await (await this.actor(canisterId, true)).transfer(params));
  }

  public async allowance({ params, canisterId }: { canisterId: string; params: NFTAllowanceArgs }) {
    return resultFormat<bigint>(await (await this.actor(canisterId)).allowance(params));
  }

  public async approve({ params, canisterId }: { canisterId: string; params: NFTApproveArgs }) {
    return resultFormat<void>(await (await this.actor(canisterId, true)).approve(params));
  }
}

export const ICPSwapAdapter = new ICPSwapNFT({
  actor: NFTCanister,
});
