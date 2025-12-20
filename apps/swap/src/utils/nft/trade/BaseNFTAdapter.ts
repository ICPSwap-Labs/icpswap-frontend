import type { NFTBuyArgs, NFTSaleArgs, NFTRevokeArgs } from "@icpswap/types";
import { StatusResult } from "@icpswap/types";

export interface BuyParameters {
  params: NFTBuyArgs;
}

export interface SaleParameters {
  params: NFTSaleArgs;
}

export interface RevokeParameters {
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
