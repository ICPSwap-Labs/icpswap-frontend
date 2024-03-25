import { ResultStatus, type NFTBuyArgs, type NFTRevokeArgs, type NFTSaleArgs } from "@icpswap/types";
import { Identity } from "types/global";
import { BaseNFTsTradeAdapter } from "./BaseNFTAdapter";
import { ICPSwapTradeAdapter } from "./ICPSwapNFTTradeAdapter";

export enum TradeAdapterName {
  ICPSwap = "ICPSwap",
}

export class NFTsTradeAdapter {
  public canisterAdapters = new Map<string, TradeAdapterName>();

  public adapters = new Map<TradeAdapterName, BaseNFTsTradeAdapter>();

  public initialAdapter(name: TradeAdapterName, adapter: BaseNFTsTradeAdapter) {
    if (this.adapters.get(name)) throw Error("This adapter is already initialed");
    this.adapters.set(name, adapter);
  }

  public register({ canisterIds, name }: { canisterIds: string[]; name: TradeAdapterName }) {
    canisterIds.forEach((canisterId) => {
      this.canisterAdapters.set(canisterId, name);
    });
  }

  public getAdapter(canisterId: string) {
    const adapterName = this.canisterAdapters.get(canisterId);
    return adapterName ? this.adapters.get(adapterName) : undefined;
  }

  public getAdapterByName(adapterName: TradeAdapterName) {
    if (!this.adapters.get(adapterName)) throw Error(`Can't not found adapter ${adapterName}`);
    return this.adapters.get(adapterName);
  }

  public async sale({
    adapterName,
    params,
    identity,
  }: {
    identity: Identity;
    adapterName: TradeAdapterName;
    params: NFTSaleArgs;
  }) {
    const adapter = this.getAdapterByName(adapterName);
    if (!adapter) return { status: ResultStatus.ERROR, data: undefined, message: "" };
    return await adapter.sale({ params, identity });
  }

  public async revoke({
    adapterName,
    params,
    identity,
  }: {
    identity: Identity;
    adapterName: TradeAdapterName;
    params: NFTRevokeArgs;
  }) {
    const adapter = this.getAdapterByName(adapterName);
    if (!adapter) return { status: ResultStatus.ERROR, data: undefined, message: "" };
    return await adapter.revoke({ params, identity });
  }

  public async buy({
    adapterName,
    params,
    identity,
  }: {
    identity: Identity;
    adapterName: TradeAdapterName;
    params: NFTBuyArgs;
  }) {
    const adapter = this.getAdapterByName(adapterName);
    if (!adapter) return { status: ResultStatus.ERROR, data: undefined, message: "" };
    return await adapter.buy({ params, identity });
  }
}

export const NFTsTrade = new NFTsTradeAdapter();

NFTsTrade.initialAdapter(TradeAdapterName.ICPSwap, ICPSwapTradeAdapter);
