export { idlFactory as EXTTokenInterfaceFactory } from "./token.did";
export type {
  _SERVICE as EXTToken,
  User as TokenUser,
  Transaction as TokenTransaction,
  ApproveRequest as TokenApproveArgs,
  HoldersRequest as TokenHolderArgs,
  Holder as TokenHolder,
  TransferRequest as TokenTransferArgs,
  TransferResponse as TokenTransferResult,
  TransactionRequest as TokenTransactionArgs,
} from "./token";

export { idlFactory as WrapICPInterfaceFactory } from "./wicp.did";
export type {
  _SERVICE as WrapICP,
  User as WrapUser,
  WrapRecord as WrapTransaction,
  MintRequest as WrapMintArgs,
  WithdrawRequest as WrapWithdrawArgs,
} from "./wicp";
