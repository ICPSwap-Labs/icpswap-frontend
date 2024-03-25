import { useMemo, useCallback, useEffect, useState } from "react";
import { parseTokenAmount, formatTokenAmount, numberToString } from "@icpswap/utils";
import { type NumberType } from "@icpswap/types";
import { getTokenStandard, useUpdateTokenStandard } from "store/token/cache/hooks";
import { getPoolTokenStandard, getPoolCanisterId } from "hooks/swap/v2/useSwapCalls";
import { FeeAmount, Currency } from "@icpswap/swap-sdk";

export function useActualSwapAmount(
  amount: NumberType | undefined,
  currency: Currency | undefined,
): string | undefined {
  return useMemo(() => {
    if (!amount || !currency) return undefined;

    const typedValue = formatTokenAmount(amount, currency.decimals);
    const fee = currency.transFee;

    if (typedValue.isGreaterThan(currency.transFee)) {
      return numberToString(parseTokenAmount(typedValue.minus(fee), currency.decimals));
    } 
      return "0";
    
  }, [amount, currency]);
}

export function useUpdatePoolTokenStandardCallback() {
  const updateTokenStandard = useUpdateTokenStandard();

  return useCallback(async (poolId: string, tokenId: string) => {
    if (!getTokenStandard(tokenId)) {
      const standard = await getPoolTokenStandard(poolId, tokenId);
      updateTokenStandard({ canisterId: tokenId, standard });
    }
  }, []);
}

export function usePoolCanisterId(
  token0CanisterId: string | undefined | null,
  token1CanisterId: string | undefined | null,
  fee: FeeAmount | undefined | null,
) {
  const poolKey = useMemo(() => {
    return token0CanisterId && token1CanisterId && fee
      ? `${token0CanisterId}_${token1CanisterId}_${String(fee)}`
      : undefined;
  }, [token0CanisterId, token1CanisterId, fee]);

  const [poolCanisterId, stePoolCanisterId] = useState("");

  useEffect(() => {
    const call = async () => {
      if (token0CanisterId && token1CanisterId && fee && poolKey && !poolCanisterId) {
        const poolCanisterId = await getPoolCanisterId(token0CanisterId, token1CanisterId, fee);
        stePoolCanisterId(poolCanisterId);
      }
    };

    call();
  }, [poolCanisterId, token0CanisterId, token1CanisterId, fee, poolKey]);

  return useMemo(() => poolCanisterId, [poolCanisterId]);
}
