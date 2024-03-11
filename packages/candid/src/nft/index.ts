export { idlFactory as NFTFileInterfaceFactory } from "./File.did";
export type { _SERVICE as NFTFile } from "./File";

export { idlFactory as NFTCanisterInterfaceFactory } from "./NFTCanister.did";
export type {
  _SERVICE as NFTCanister,
  CanisterInfo as NFTCanisterInfo,
  IcsMetadata as NFTTokenMetadata,
  TransferRecord as NFTTransaction,
  IcsMintRequest as NFTMintArgs,
  IcsMintRequests as NFTBatchMintArgs,
  TransferRequest as NFTTransferArgs,
  TransferResponse as NFTTransferResult,
  AllowanceRequest as NFTAllowanceArgs,
  ApproveRequest as NFTApproveArgs,
} from "./NFTCanister";

export { default as V1NFTCanisterInterfaceFactory } from "./v1NFTCanister.did";
export type { default as V1NFTCanister } from "./v1NFTCanister";

export { idlFactory as V3NFTCanisterControllerInterfaceFactory } from "./V3NFTCanisterController.did";
export type {
  _SERVICE as V3NFTCanisterController,
  CanisterInfo as NFTControllerInfo,
  CanisterRequest as NFTControllerArgs,
} from "./V3NFTCanisterController";

export { idlFactory as V3TradeCanisterInterfaceFactory } from "./V3TradeCanister.did";
export type {
  _SERVICE as V3TradeCanister,
  TxInfoResponse as TradeTransaction,
  OrderInfo,
  StatResponse as TotalTradeStat,
  SaleRequest as NFTSaleArgs,
  BuyRequest as NFTBuyArgs,
  RevokeRequest as NFTRevokeArgs,
} from "./V3TradeCanister";

export { idlFactory as V3TradeStatInterfaceFactory } from "./V3TradeStat.did";
export type {
  _SERVICE as V3TradeStat,
  TradeStatResp as TradeStateResult,
} from "./V3TradeStat";

export { idlFactory as ExtNFTInterfaceFactory } from "./EXT.did";
export type { _SERVICE as ExtNFTService } from "./EXT";
