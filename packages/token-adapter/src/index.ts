import { ActorIdentity, Override } from "@icpswap/types";
import {
  HoldersRequest,
  TotalHoldersRequest,
  SupplyRequest,
  BalanceRequest,
  TransferRequest,
  SetFeeRequest,
  SetFeeToRequest,
  TransactionRequest,
  ApproveRequest,
  AllowanceRequest,
  MetadataRequest,
  SetLogoRequest,
  ActualReceivedByTransferRequest,
} from "./BaseTokenAdapter";
import { EXTAdapter, EXTTokenAdapter } from "./EXTAdapter";
import { DIP20Adapter, DIP20TokenAdapter } from "./DIP20Adapter";
import { DIP20WICPAdapter, DIP20WICPTokenAdapter } from "./DIP20WICPAdapter";
import { DIP20XTCAdapter, DIP20XTCTokenAdapter } from "./DIP20XTCAdapter";
import { icrc1Adapter, ICRC1Adapter } from "./ICRC1";
import { icrc2Adapter, ICRC2Adapter } from "./ICRC2";
import { icpAdapter, ICPAdapter } from "./ICP";
import { TOKEN_STANDARD } from "./types";

export type AdapterRequest<T> = T;

export type AdapterIdentityRequest<T> = Override<T, { identity: ActorIdentity }>;

export type RegisterProps = { canisterId: string; standard: TOKEN_STANDARD }[];

export class TokenAdapter {
  public canisterAdapters = new Map<string, TOKEN_STANDARD>();

  public adapters = new Map<
    TOKEN_STANDARD,
    | DIP20XTCTokenAdapter
    | DIP20WICPTokenAdapter
    | DIP20TokenAdapter
    | EXTTokenAdapter
    | ICRC1Adapter
    | ICRC2Adapter
    | ICPAdapter
  >();

  public initialAdapter(
    name: TOKEN_STANDARD,
    adapter:
      | DIP20XTCTokenAdapter
      | DIP20WICPTokenAdapter
      | DIP20TokenAdapter
      | EXTTokenAdapter
      | ICRC1Adapter
      | ICRC2Adapter
      | ICPAdapter,
  ) {
    if (this.adapters.get(name)) throw Error("This adapter is already initialed");
    this.adapters.set(name, adapter);
  }

  public register(standards: RegisterProps) {
    standards.forEach(({ standard, canisterId }) => {
      this.canisterAdapters.set(canisterId, standard);
    });
  }

  public getAll() {
    return this.canisterAdapters;
  }

  public getAdapter(canisterId: string) {
    let standard = this.canisterAdapters.get(canisterId);
    if (!standard) {
      console.error(`Can't not found adapter ===> ${canisterId}`);
      standard = TOKEN_STANDARD.EXT;
    }
    return this.getAdapterByName(standard);
  }

  public getAdapterByName(adapterName: TOKEN_STANDARD | undefined) {
    if (!adapterName || !this.adapters.get(adapterName)) throw Error(`Can't not found adapter ${adapterName}`);
    return this.adapters.get(adapterName);
  }

  public async totalHolders({ canisterId }: AdapterRequest<TotalHoldersRequest>) {
    const adapter = this.getAdapter(canisterId);
    return await adapter!.totalHolders({ canisterId });
  }

  public async holders({ params, canisterId }: AdapterRequest<HoldersRequest>) {
    const adapter = this.getAdapter(canisterId);
    return await adapter!.holders({
      canisterId,
      params,
    });
  }

  public async supply({ canisterId }: AdapterRequest<SupplyRequest>) {
    const adapter = this.getAdapter(canisterId);
    return await adapter!.supply({
      canisterId,
    });
  }

  public async balance({ canisterId, params }: AdapterRequest<BalanceRequest>) {
    const adapter = this.getAdapter(canisterId);

    return await adapter!.balance({
      canisterId,
      params,
    });
  }

  public async transfer({ canisterId, params, identity }: AdapterIdentityRequest<TransferRequest>) {
    const adapter = this.getAdapter(canisterId);
    return await adapter!.transfer({
      canisterId,
      params,
      identity,
    });
  }

  public async setFee({ canisterId, identity, params }: AdapterIdentityRequest<SetFeeRequest>) {
    const adapter = this.getAdapter(canisterId);
    return await adapter!.setFee({
      canisterId,
      identity,
      params,
    });
  }

  public async setFeeTo({ canisterId, identity, params }: AdapterIdentityRequest<SetFeeToRequest>) {
    const adapter = this.getAdapter(canisterId);
    return await adapter!.setFeeTo({
      canisterId,
      identity,
      params,
    });
  }

  public async transactions({ canisterId, params }: AdapterRequest<TransactionRequest>) {
    const adapter = this.getAdapter(canisterId);
    return await adapter!.transactions({
      canisterId,
      params,
    });
  }

  public async approve({ canisterId, identity, params }: AdapterRequest<ApproveRequest>) {
    const adapter = this.getAdapter(canisterId);
    return await adapter!.approve({
      canisterId,
      params,
      identity,
    });
  }

  public async allowance({ canisterId, params }: AdapterRequest<AllowanceRequest>) {
    const adapter = this.getAdapter(canisterId);
    return await adapter!.allowance({
      canisterId,
      params,
    });
  }

  public async metadata({ canisterId }: AdapterRequest<MetadataRequest>) {
    const adapter = this.getAdapter(canisterId);
    return await adapter!.metadata({
      canisterId,
    });
  }

  public async setLogo({ canisterId, identity, params }: AdapterIdentityRequest<SetLogoRequest>) {
    const adapter = this.getAdapter(canisterId);
    return await adapter!.setLogo({
      canisterId,
      params,
      identity,
    });
  }

  public actualReceivedByTransfer(request: ActualReceivedByTransferRequest) {
    const adapter = this.getAdapter(request.canisterId);
    return adapter!.actualReceivedByTransfer(request);
  }

  public async getMintingAccount({ canisterId }: { canisterId: string }) {
    const adapter = this.getAdapter(canisterId);
    return await adapter!.getMintingAccount({
      canisterId,
    });
  }
}

export const tokenAdapter = new TokenAdapter();

export const registerTokens = (standards: RegisterProps) => tokenAdapter.register(standards);

tokenAdapter.initialAdapter(TOKEN_STANDARD.EXT, EXTAdapter);
tokenAdapter.initialAdapter(TOKEN_STANDARD.DIP20, DIP20Adapter);
tokenAdapter.initialAdapter(TOKEN_STANDARD.DIP20_XTC, DIP20XTCAdapter);
tokenAdapter.initialAdapter(TOKEN_STANDARD.DIP20_WICP, DIP20WICPAdapter);
tokenAdapter.initialAdapter(TOKEN_STANDARD.ICRC1, icrc1Adapter);
tokenAdapter.initialAdapter(TOKEN_STANDARD.ICRC2, icrc2Adapter);
tokenAdapter.initialAdapter(TOKEN_STANDARD.ICP, icpAdapter);

export {
  EXTAdapter,
  DIP20Adapter,
  DIP20XTCAdapter,
  DIP20WICPAdapter,
  ICRC1Adapter,
  ICRC2Adapter,
  icrc1Adapter,
  icrc2Adapter,
  icpAdapter,
  ICPAdapter,
  TOKEN_STANDARD,
};

export * from "./token-standard-verification";
export * from "./utils";
