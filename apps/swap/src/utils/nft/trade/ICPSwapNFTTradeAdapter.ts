import { BaseNFTsTradeAdapter } from "./BaseNFTAdapter";
import type { NFTBuyArgs, NFTSaleArgs, NFTRevokeArgs } from "@icpswap/types";
import { resultFormat } from "@icpswap/utils";
import { Identity } from "types/global";
import { NFTTradeCanister } from "@icpswap/actor";

export class ICPSwapNFTsTradeAdapter extends BaseNFTsTradeAdapter {
  public async buy({ params, identity }: { params: NFTBuyArgs; identity: Identity }) {
    return resultFormat<boolean>(await (await this.actor(identity)).buy(params));
  }

  public async sale({ params, identity }: { params: NFTSaleArgs; identity: Identity }) {
    return resultFormat<boolean>(await (await this.actor(identity)).sale(params));
  }

  public async revoke({ params, identity }: { params: NFTRevokeArgs; identity: Identity }) {
    return resultFormat<boolean>(await (await this.actor(identity)).revoke(params));
  }
}

export const ICPSwapTradeAdapter = new ICPSwapNFTsTradeAdapter({
  actor: NFTTradeCanister,
});
