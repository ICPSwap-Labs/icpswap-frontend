import { ImportedNFT } from "types/nft";

export interface NFTState {
  userSelectedCanisters: string[];
  importedNFTs: ImportedNFT[];
}

export const initialState: NFTState = {
  userSelectedCanisters: [],
  importedNFTs: [],
};
