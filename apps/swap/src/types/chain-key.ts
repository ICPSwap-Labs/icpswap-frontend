export enum DogeDissolveTxState {
  "Signing" = "Signing",
  "Confirmed" = "Confirmed",
  "Sending" = "Sending",
  "AmountTooLow" = "AmountTooLow",
  "WillReimburse" = "WillReimburse",
  "Unknown" = "Unknown",
  "Submitted" = "Submitted",
  "Reimbursed" = "Reimbursed",
  "Pending" = "Pending",
}

export type DogeDissolveTx = {
  principal: string;
  txid: string | undefined;
  state: DogeDissolveTxState;
  block_index: string;
  value: string;
  id: string;
};
