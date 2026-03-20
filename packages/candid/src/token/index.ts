export type {
  _SERVICE as EXTToken,
  ApproveRequest as TokenApproveArgs,
  Holder as TokenHolder,
  HoldersRequest as TokenHolderArgs,
  Transaction as TokenTransaction,
  TransactionRequest as TokenTransactionArgs,
  TransferRequest as TokenTransferArgs,
  TransferResponse as TokenTransferResult,
  User as TokenUser,
} from "./token";
export { idlFactory as EXTTokenInterfaceFactory } from "./token.did";
export type {
  _SERVICE as WrapICP,
  MintRequest as WrapMintArgs,
  User as WrapUser,
  WithdrawRequest as WrapWithdrawArgs,
  WrapRecord as WrapTransaction,
} from "./wicp";
export { idlFactory as WrapICPInterfaceFactory } from "./wicp.did";
