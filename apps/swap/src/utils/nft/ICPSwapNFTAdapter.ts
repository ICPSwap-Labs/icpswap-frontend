import { BaseNFTAdapter } from "./BaseNFTAdapter";
import type { NFTTransferArgs, NFTTransferResult, NFTAllowanceArgs, NFTApproveArgs } from "@icpswap/types";
import { resultFormat } from "@icpswap/utils";
import { NFTCanister } from "@icpswap/actor";
import { Identity } from "types/global";

export class ICPSwapNFT extends BaseNFTAdapter {
  public async transfer({
    canisterId,
    params,
    identity,
  }: {
    canisterId: string;
    params: NFTTransferArgs;
    identity: Identity;
  }) {
    return resultFormat<NFTTransferResult>(await (await this.actor(canisterId, identity)).transfer(params));
  }

  public async allowance({ params, canisterId }: { canisterId: string; params: NFTAllowanceArgs }) {
    return resultFormat<bigint>(await (await this.actor(canisterId)).allowance(params));
  }

  public async approve({
    params,
    canisterId,
    identity,
  }: {
    identity: Identity;
    canisterId: string;
    params: NFTApproveArgs;
  }) {
    return resultFormat<void>(await (await this.actor(canisterId, identity)).approve(params));
  }
}

export const ICPSwapAdapter = new ICPSwapNFT({
  actor: NFTCanister,
});
