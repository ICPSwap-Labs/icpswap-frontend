import { isUndefinedOrNull } from "@icpswap/utils";
import { useBalanceConvertStore } from "components/Wallet/BalanceConvert/store";
import { useConvertSwap } from "hooks/wallet/useConvertSwap";
import { useCallback, useMemo } from "react";

export function useConvertCallback() {
  const {
    tokensConvertToSwap,
    setConvertedTokenIds,
    setTokensConvertToIcp,
    setConvertLoading,
    convertLoading: loading,
    setCheckedConvertTokenIds,
  } = useBalanceConvertStore();
  const convertToSwap = useConvertSwap();

  const callback = useCallback(async () => {
    if (isUndefinedOrNull(tokensConvertToSwap)) return;

    setConvertLoading(true);

    for (let i = 0; i < tokensConvertToSwap.length; i++) {
      const element = tokensConvertToSwap[i];

      const convertSuccess = await convertToSwap({
        balance: element.amount,
        token: element.token,
        tokenId: element.token.address,
        poolId: element.poolId,
      });

      if (convertSuccess) {
        setConvertedTokenIds([element.tokenId]);
      }
    }

    setTokensConvertToIcp(undefined);
    setConvertLoading(false);
    setCheckedConvertTokenIds([]);
  }, [
    tokensConvertToSwap,
    convertToSwap,
    setTokensConvertToIcp,
    setCheckedConvertTokenIds,
    setConvertLoading,
    setConvertedTokenIds,
  ]);

  return useMemo(() => ({ loading, callback }), [callback, loading]);
}
