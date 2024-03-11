export { idlFactory as ICRC1InterfaceFactory } from "./icrc1.did";
export type {
  _SERVICE as ICRC1_SERVICE,
  GetTransactionsResponse,
  GetTransactionsRequest,
  Transaction as ICRCTransaction,
  Value as MetadataValue,
} from "./icrc1";

export { idlFactory as ICRC2InterfaceFactory } from "./icrc2.did";
export type { _SERVICE as ICRC2 } from "./icrc2";

export { idlFactory as ICRCArchiveInterfaceFactory } from "./icrc.archive.did";
export type {
  _SERVICE as ICRCArchive,
  Transaction as ArchivedTransaction,
} from "./icrc.archive";
