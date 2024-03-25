import { useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "store/hooks";
import { ImportedNFT } from "types/nft";
import { updateUserSelectedCanisters, deleteUserSelectedCanisters, importNFT, deleteNFT } from "./actions";

export function useSelectedCanisters() {
  return useAppSelector((state) => state.nft.userSelectedCanisters);
}

export function useSelectedCanistersManager(): [
  string[],
  (selectedCanisters: string[]) => void,
  (selectedCanister: string) => void,
] {
  const dispatch = useAppDispatch();
  const userSelectedCanisters = useSelectedCanisters();

  const setUserSelectedCanistersCallback = useCallback(
    (selectedCanisters: string[]) => {
      dispatch(updateUserSelectedCanisters(selectedCanisters));
    },
    [dispatch],
  );

  const deleteUserSelectedCanisterCallback = useCallback(
    (selectedCanister: string) => {
      dispatch(deleteUserSelectedCanisters(selectedCanister));
    },
    [dispatch],
  );

  return [userSelectedCanisters, setUserSelectedCanistersCallback, deleteUserSelectedCanisterCallback];
}

export function useImportedNFTs() {
  return useAppSelector((state) => state.nft.importedNFTs);
}

export function useEXTManager() {
  const dispatch = useAppDispatch();
  const importedNFTs = useImportedNFTs();

  const importCall = useCallback(
    (val: ImportedNFT) => {
      dispatch(importNFT(val));
    },
    [dispatch],
  );

  const deleteCall = useCallback(
    (canisterId: string) => {
      dispatch(deleteNFT({ canisterId }));
    },
    [dispatch],
  );

  return useMemo(
    () => ({ nfts: importedNFTs, importNFT: importCall, deleteNFT: deleteCall }),
    [importedNFTs, importCall, deleteCall],
  );
}
