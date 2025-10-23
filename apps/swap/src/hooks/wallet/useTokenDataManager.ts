import { useEffect, useMemo } from "react";
import { ICP, WRAPPED_ICP } from "@icpswap/tokens";
import { BigNumber, isUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { useToken } from "hooks/index";
import { useInfoToken } from "@icpswap/hooks";
import { useWalletTokenContext } from "components/Wallet/token/context";

interface UseTokenDataManagerProps {
  tokenId: string;
  tokenBalance: string | undefined;
  balanceLoading: boolean;
}

export function useTokenDataManager({ tokenId, tokenBalance, balanceLoading }: UseTokenDataManagerProps) {
  const [, token] = useToken(tokenId);
  const { setTotalValue, setTotalUSDBeforeChange, setNoUSDTokens } = useWalletTokenContext();

  const infoTokenAddress = useMemo(() => {
    if (tokenId === WRAPPED_ICP.address) return ICP.address;
    return tokenId;
  }, [tokenId]);

  const infoToken = useInfoToken(infoTokenAddress);
  const tokenPrice = infoToken?.price;

  const usdValue = useMemo(() => {
    if (isUndefinedOrNull(tokenPrice) || isUndefinedOrNull(tokenBalance) || isUndefinedOrNull(token)) return undefined;
    return parseTokenAmount(tokenBalance, token.decimals).multipliedBy(tokenPrice);
  }, [tokenBalance, token, tokenPrice]);

  useEffect(() => {
    if (token && token.decimals !== undefined && token.transFee !== undefined && tokenBalance && infoToken) {
      setTotalValue(token.address, parseTokenAmount(tokenBalance, token.decimals).multipliedBy(infoToken.price));

      const priceBeforeChangePercent = new BigNumber(infoToken.priceChange24H).dividedBy(100).plus(1);

      // If priceBeforeChangePercent is equal to 0, the current price is 0
      // The previous price can't be calculated
      // So ignore this token's usd value
      const priceBeforeChange = priceBeforeChangePercent.isEqualTo(0)
        ? 0
        : new BigNumber(infoToken.price).div(priceBeforeChangePercent);

      setTotalUSDBeforeChange(
        token.address,
        parseTokenAmount(tokenBalance, token.decimals).multipliedBy(priceBeforeChange),
      );
    }
  }, [tokenBalance, infoToken, token, tokenPrice]);

  useEffect(() => {
    if (
      token &&
      token.decimals !== undefined &&
      token.transFee !== undefined &&
      tokenBalance &&
      balanceLoading === false &&
      !infoToken
    ) {
      setNoUSDTokens(token.address);
    }
  }, [token, tokenBalance, balanceLoading, infoToken]);

  return useMemo(
    () => ({
      usdValue,
    }),
    [usdValue],
  );
}
