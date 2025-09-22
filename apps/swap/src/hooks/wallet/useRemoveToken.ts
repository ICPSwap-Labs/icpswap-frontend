import { useCallback } from "react";
import { useTaggedTokenManager } from "store/wallet/hooks";

export function useRemoveTokenHandler() {
  const { deleteTaggedTokens } = useTaggedTokenManager();

  return useCallback(
    (tokenId: string) => {
      deleteTaggedTokens([tokenId]);
    },
    [deleteTaggedTokens],
  );
}
