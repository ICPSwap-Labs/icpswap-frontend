import type { NFTTransferArgs, NFTTransferResult, NFTAllowanceArgs, NFTApproveArgs } from "@icpswap/types";
import { StatusResult } from "@icpswap/types";

export interface TransferParameters {
  params: NFTTransferArgs;
  canisterId: string;
}
export abstract class BaseNFTAdapter {
  public readonly actor: any;

  constructor({ actor }: { actor: (canister: string, identity?: true) => any }) {
    this.actor = actor;
  }

  public abstract transfer(params: TransferParameters): Promise<StatusResult<NFTTransferResult>>;

  public abstract allowance(params: { canisterId: string; params: NFTAllowanceArgs }): Promise<StatusResult<bigint>>;

  public abstract approve(params: { canisterId: string; params: NFTApproveArgs }): Promise<StatusResult<void>>;
}
