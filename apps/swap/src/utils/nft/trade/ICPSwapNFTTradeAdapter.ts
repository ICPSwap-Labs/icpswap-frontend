import type { NFTBuyArgs, NFTSaleArgs, NFTRevokeArgs } from "@icpswap/types";
import { resultFormat } from "@icpswap/utils";
import { NFTTradeCanister } from "@icpswap/actor";
import { BaseNFTsTradeAdapter } from "./BaseNFTAdapter";

export class ICPSwapNFTsTradeAdapter extends BaseNFTsTradeAdapter {
  public async buy({ params }: { params: NFTBuyArgs }) {
    return resultFormat<boolean>(await (await this.actor(true)).buy(params));
  }

  public async sale({ params }: { params: NFTSaleArgs }) {
    return resultFormat<boolean>(await (await this.actor(true)).sale(params));
  }

  public async revoke({ params }: { params: NFTRevokeArgs }) {
    return resultFormat<boolean>(await (await this.actor(true)).revoke(params));
  }
}

export const ICPSwapTradeAdapter = new ICPSwapNFTsTradeAdapter({
  actor: NFTTradeCanister,
});
