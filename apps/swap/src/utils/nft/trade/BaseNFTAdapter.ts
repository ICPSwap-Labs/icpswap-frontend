import type { NFTBuyArgs, NFTSaleArgs, NFTRevokeArgs } from "@icpswap/types";
import { StatusResult } from "@icpswap/types";
import { Identity } from "types/global";

export interface BuyParameters {
  identity: Identity;
  params: NFTBuyArgs;
}

export interface SaleParameters {
  identity: Identity;
  params: NFTSaleArgs;
}

export interface RevokeParameters {
  identity: Identity;
  params: NFTRevokeArgs;
}

export abstract class BaseNFTsTradeAdapter {
  public readonly actor: any;

  constructor({ actor }: { actor: any }) {
    this.actor = actor;
  }

  public abstract buy(params: BuyParameters): Promise<StatusResult<boolean>>;

  public abstract sale(params: SaleParameters): Promise<StatusResult<boolean>>;

  public abstract revoke(params: RevokeParameters): Promise<StatusResult<boolean>>;
}
