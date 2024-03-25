import { type NFTTransferArgs, type NFTAllowanceArgs, type NFTApproveArgs, ResultStatus } from "@icpswap/types";
import { Identity } from "types/global";
import { BaseNFTAdapter } from "./BaseNFTAdapter";
import { ICPSwapAdapter } from "./ICPSwapNFTAdapter";

export class NFT {
  public canisterAdapters = new Map<string, AdapterName>();

  public adapters = new Map<AdapterName, BaseNFTAdapter>();

  public initialAdapter(name: AdapterName, adapter: BaseNFTAdapter) {
    if (this.adapters.get(name)) throw Error("This adapter is already initialed");
    this.adapters.set(name, adapter);
  }

  public register({ canisterIds, name }: { canisterIds: string[]; name: AdapterName }) {
    canisterIds.forEach((canisterId) => {
      this.canisterAdapters.set(canisterId, name);
    });
  }

  public getAdapter(canisterId: string) {
    const adapterName = this.canisterAdapters.get(canisterId);
    return adapterName ? this.adapters.get(adapterName) : undefined;
  }

  public getAdapterByName(adapterName: AdapterName) {
    if (!this.adapters.get(adapterName)) throw Error(`Can't not found adapter ${adapterName}`);
    return this.adapters.get(adapterName);
  }

  public async transfer({
    adapterName,
    params,
    identity,
    canisterId,
  }: {
    identity: Identity;
    adapterName: AdapterName;
    params: NFTTransferArgs;
    canisterId: string;
  }) {
    const adapter = this.getAdapterByName(adapterName);

    if (!adapter) return { status: ResultStatus.ERROR, data: undefined, message: "No adapter" };

    return await adapter.transfer({ canisterId, params, identity });
  }

  public async allowance({
    adapterName,
    params,
    canisterId,
  }: {
    canisterId: string;
    adapterName: AdapterName;
    params: NFTAllowanceArgs;
  }) {
    const adapter = this.getAdapterByName(adapterName);
    if (!adapter) return { status: ResultStatus.ERROR, data: undefined, message: "No adapter" };
    return await adapter.allowance({
      canisterId,
      params,
    });
  }

  public async approve({
    params,
    canisterId,
    adapterName,
    identity,
  }: {
    adapterName: AdapterName;
    canisterId: string;
    params: NFTApproveArgs;
    identity: Identity;
  }) {
    const adapter = this.getAdapterByName(adapterName);
    if (!adapter) return { status: ResultStatus.ERROR, data: undefined, message: "No adapter" };
    return await adapter.approve({
      canisterId,
      identity,
      params,
    });
  }
}

export const NFTs = new NFT();

export const registerNFTs = ({ canisterIds, name }: { canisterIds: string[]; name: AdapterName }) =>
  NFTs.register({ canisterIds, name });

export enum AdapterName {
  ICPSwap = "ICPSwap",
}

NFTs.initialAdapter(AdapterName.ICPSwap, ICPSwapAdapter);
