import { Allowance } from "../../types/nft";

export interface NFTTradeState {
  readonly allowance: Allowance[];
}

export const initialState: NFTTradeState = {
  allowance: [],
};
