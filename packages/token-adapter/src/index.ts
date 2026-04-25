import type { ActorIdentity, Override } from "@icpswap/types";
import type {
  ActualReceivedByTransferRequest,
  AllowanceRequest,
  ApproveRequest,
  BalanceRequest,
  MetadataRequest,
  SetFeeRequest,
  SetFeeToRequest,
  SupplyRequest,
  TransactionRequest,
  TransferRequest,
} from "./BaseTokenAdapter";
import { DIP20Adapter, type DIP20TokenAdapter } from "./DIP20Adapter";
import { DIP20WICPAdapter, type DIP20WICPTokenAdapter } from "./DIP20WICPAdapter";
import { DIP20XTCAdapter, type DIP20XTCTokenAdapter } from "./DIP20XTCAdapter";
import { EXTAdapter, type EXTTokenAdapter } from "./EXTAdapter";
import { ICPAdapter, icpAdapter } from "./ICP";
import { ICRC1Adapter, icrc1Adapter } from "./ICRC1";
import { ICRC2Adapter, icrc2Adapter } from "./ICRC2";
import { TOKEN_STANDARD } from "./types";

export type AdapterRequest<T> = T;

export type AdapterIdentityRequest<T> = Override<T, { identity: ActorIdentity }>;

export type RegisterProps = { canisterId: string; standard: TOKEN_STANDARD }[];

export type TokenAdapterInstance =
  | DIP20XTCTokenAdapter
  | DIP20WICPTokenAdapter
  | DIP20TokenAdapter
  | EXTTokenAdapter
  | ICRC1Adapter
  | ICRC2Adapter
  | ICPAdapter;

export class TokenAdapter {
  public canisterAdapters = new Map<string, TOKEN_STANDARD>();

  public adapters = new Map<TOKEN_STANDARD, TokenAdapterInstance>();

  public initialAdapter(name: TOKEN_STANDARD, adapter: TokenAdapterInstance) {
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

  public getAdapter(canisterId: string): TokenAdapterInstance {
    const standard = this.canisterAdapters.get(canisterId) ?? TOKEN_STANDARD.ICRC1;
    return this.getAdapterByName(standard);
  }

  public getAdapterByName(adapterName: TOKEN_STANDARD | undefined): TokenAdapterInstance {
    const adapter = adapterName ? this.adapters.get(adapterName) : undefined;
    if (!adapter) throw Error(`Can't not found adapter ${adapterName}`);
    return adapter;
  }

  public async supply({ canisterId }: AdapterRequest<SupplyRequest>) {
    return this.getAdapter(canisterId).supply({ canisterId });
  }

  public async balance({ canisterId, params }: AdapterRequest<BalanceRequest>) {
    return this.getAdapter(canisterId).balance({ canisterId, params });
  }

  public async transfer({ canisterId, params, identity }: AdapterIdentityRequest<TransferRequest>) {
    return this.getAdapter(canisterId).transfer({ canisterId, params, identity });
  }

  public async setFee({ canisterId, identity, params }: AdapterIdentityRequest<SetFeeRequest>) {
    return this.getAdapter(canisterId).setFee({ canisterId, identity, params });
  }

  public async setFeeTo({ canisterId, identity, params }: AdapterIdentityRequest<SetFeeToRequest>) {
    return this.getAdapter(canisterId).setFeeTo({ canisterId, identity, params });
  }

  public async transactions({ canisterId, params }: AdapterRequest<TransactionRequest>) {
    return this.getAdapter(canisterId).transactions({ canisterId, params });
  }

  public async approve({ canisterId, identity, params }: AdapterRequest<ApproveRequest>) {
    return this.getAdapter(canisterId).approve({ canisterId, params, identity });
  }

  public async allowance({ canisterId, params }: AdapterRequest<AllowanceRequest>) {
    return this.getAdapter(canisterId).allowance({ canisterId, params });
  }

  public async metadata({ canisterId }: AdapterRequest<MetadataRequest>) {
    return this.getAdapter(canisterId).metadata({ canisterId });
  }

  public actualReceivedByTransfer(request: ActualReceivedByTransferRequest) {
    return this.getAdapter(request.canisterId).actualReceivedByTransfer(request);
  }

  public async getMintingAccount({ canisterId }: { canisterId: string }) {
    return this.getAdapter(canisterId).getMintingAccount({ canisterId });
  }
}

export const tokenAdapter = new TokenAdapter();

export const registerTokens = (standards: RegisterProps) => {
  tokenAdapter.register(standards);
};

tokenAdapter.initialAdapter(TOKEN_STANDARD.EXT, EXTAdapter);
tokenAdapter.initialAdapter(TOKEN_STANDARD.DIP20, DIP20Adapter);
tokenAdapter.initialAdapter(TOKEN_STANDARD.DIP20_XTC, DIP20XTCAdapter);
tokenAdapter.initialAdapter(TOKEN_STANDARD.DIP20_WICP, DIP20WICPAdapter);
tokenAdapter.initialAdapter(TOKEN_STANDARD.ICRC1, icrc1Adapter);
tokenAdapter.initialAdapter(TOKEN_STANDARD.ICRC2, icrc2Adapter);
tokenAdapter.initialAdapter(TOKEN_STANDARD.ICP, icpAdapter);

export * from "./token-standard-verification";
export * from "./utils";
export {
  DIP20Adapter,
  DIP20WICPAdapter,
  DIP20XTCAdapter,
  EXTAdapter,
  ICPAdapter,
  ICRC1Adapter,
  ICRC2Adapter,
  icpAdapter,
  icrc1Adapter,
  icrc2Adapter,
  TOKEN_STANDARD,
};
