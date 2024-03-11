import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export interface Metadata {
  fee: bigint;
  decimals: number;
  owner: Principal;
  logo: string;
  name: string;
  totalSupply: bigint;
  symbol: string;
}
export interface TokenInfo {
  holderNumber: bigint;
  deployTime: bigint;
  metadata: Metadata;
  historySize: bigint;
  cycles: bigint;
  feeTo: Principal;
}
export type TxReceipt =
  | { Ok: bigint }
  | {
      Err:
        | { InsufficientAllowance: null }
        | { InsufficientBalance: null }
        | { ErrorOperationStyle: null }
        | { Unauthorized: null }
        | { LedgerTrap: null }
        | { ErrorTo: null }
        | { Other: string }
        | { BlockUsed: null }
        | { AmountTooSmall: null };
    };
export interface _SERVICE {
  allowance: ActorMethod<[Principal, Principal], bigint>;
  approve: ActorMethod<[Principal, bigint], TxReceipt>;
  balanceOf: ActorMethod<[Principal], bigint>;
  cleanOutOldAllowances: ActorMethod<[], bigint>;
  decimals: ActorMethod<[], number>;
  filterAllowancesArray: ActorMethod<[bigint], Array<[Principal, Array<[Principal, [bigint, bigint]]>]>>;
  getASize: ActorMethod<[], bigint>;
  getAgeAllowanceLimit: ActorMethod<[], bigint>;
  getAllowanceSize: ActorMethod<[], bigint>;
  getAllowancesArray: ActorMethod<[], Array<[Principal, Array<[Principal, [bigint, bigint]]>]>>;
  getMaxAllowances: ActorMethod<[], bigint>;
  getMetadata: ActorMethod<[], Metadata>;
  getResultArrayIndex: ActorMethod<[], bigint>;
  getSpendersSize: ActorMethod<[], bigint>;
  getTokenFee: ActorMethod<[], bigint>;
  getTokenInfo: ActorMethod<[], TokenInfo>;
  getUserApprovals: ActorMethod<[Principal], Array<[Principal, bigint]>>;
  historySize: ActorMethod<[], bigint>;
  logo: ActorMethod<[], string>;
  name: ActorMethod<[], string>;
  setAgeAllowanceLimit: ActorMethod<[], bigint>;
  setFee: ActorMethod<[bigint], undefined>;
  setLogo: ActorMethod<[string], undefined>;
  setMaxAllowances: ActorMethod<[bigint], undefined>;
  setName: ActorMethod<[string], undefined>;
  setOwner: ActorMethod<[Principal], undefined>;
  symbol: ActorMethod<[], string>;
  totalSupply: ActorMethod<[], bigint>;
  transfer: ActorMethod<[Principal, bigint], TxReceipt>;
  transferFrom: ActorMethod<[Principal, Principal, bigint], TxReceipt>;
}
