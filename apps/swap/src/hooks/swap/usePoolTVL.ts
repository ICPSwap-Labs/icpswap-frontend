import { useMemo } from "react";
import { useUSDValue, useUSDPrice } from "hooks/useUSDPrice";
import { CurrencyAmount, computePoolAddress, Token, FeeAmount } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";
import { usePoolTotalVolumeCall } from "hooks/swap/v2/useSwapCalls";
import { usePoolTokenAmountsFromKey } from "hooks/swap/v3Calls";
import { formatDollarAmount, numberToString } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { useTokenBalance } from "hooks/token";

export function usePoolTVL(
  token0: Token | undefined,
  token1: Token | undefined,
  balance0: bigint | number,
  balance1: bigint | number,
) {
  const amount0 = token0 && balance0 ? CurrencyAmount.fromRawAmount(token0, numberToString(balance0)) : undefined;
  const amount1 = token1 && balance1 ? CurrencyAmount.fromRawAmount(token1, numberToString(balance1)) : undefined;

  const token0USDValue = useUSDValue(amount0);
  const token1USDValue = useUSDValue(amount1);

  return useMemo(() => {
    if (!token0USDValue || !token1USDValue) return formatDollarAmount(0);

    return formatDollarAmount(token0USDValue.plus(token1USDValue).toNumber());
  }, [token1USDValue, token0USDValue]);
}

export function usePoolTVLAndTotalVolume(
  token0: Token | undefined,
  token1: Token | undefined,
  balance0: bigint | number,
  balance1: bigint | number,
  fee: FeeAmount,
  format = true,
) {
  const token0USDPrice = useUSDPrice(token0);
  const token1USDPrice = useUSDPrice(token1);

  const poolKey = useMemo(() => {
    return token0 && token1 && fee
      ? computePoolAddress({
          tokenA: token0,
          tokenB: token1,
          fee,
        })
      : undefined;
  }, [token0, token1, fee]);

  const { result: totalVolume } = usePoolTotalVolumeCall(poolKey);

  const poolTVL = useMemo(() => {
    if (!token0 || !token1 || !token0USDPrice || !token1USDPrice || !balance0 || !balance1) {
      if (format) {
        return formatDollarAmount(0);
      }
      return 0;
    }

    const token0TVLValue = new BigNumber(token0USDPrice).multipliedBy(balance0.toString());
    const token1TVLValue = new BigNumber(token1USDPrice).multipliedBy(balance1.toString());

    if (format) {
      return formatDollarAmount(token0TVLValue.plus(token1TVLValue).toNumber());
    }
    return token0TVLValue.plus(token1TVLValue).toNumber();
  }, [token0, token1, token0USDPrice, token1USDPrice, balance0, balance1]);

  const poolTotalVolumeValue = useMemo(() => {
    if (!token0 || !totalVolume || !token0USDPrice) {
      if (format) {
        return formatDollarAmount(0);
      }
      return 0;
    }

    const token0TotalVolume = new BigNumber(token0USDPrice).multipliedBy(totalVolume.tokenA.toString());

    // const token1TotalVolume = token1USDPrice.quote(
    //   CurrencyAmount.fromRawAmount(token1, numberToString(totalVolume.tokenB))
    // );

    // return formatDollarAmount(new BigNumber(token0TotalVolume.toExact()).plus(token1TotalVolume.toExact()).toNumber());
    if (format) {
      return formatDollarAmount(token0TotalVolume.toNumber());
    }
    return token0TotalVolume.toNumber();
  }, [totalVolume, token0USDPrice, token0]);

  return useMemo(() => {
    return {
      poolTVL,
      poolTotalVolume: poolTotalVolumeValue,
    };
  }, [poolTVL, poolTotalVolumeValue]);
}

export function useV3PoolTVL(
  token0: Token | undefined,
  token1: Token | undefined,
  balance0: bigint | number,
  balance1: bigint | number,
) {
  const amount0 = token0 && balance0 ? CurrencyAmount.fromRawAmount(token0, numberToString(balance0)) : undefined;
  const amount1 = token1 && balance1 ? CurrencyAmount.fromRawAmount(token1, numberToString(balance1)) : undefined;

  const token0USDValue = useUSDValue(amount0);
  const token1USDValue = useUSDValue(amount1);

  return useMemo(() => {
    if (!token0USDValue || !token1USDValue) return formatDollarAmount(0);

    return formatDollarAmount(new BigNumber(token0USDValue).plus(token1USDValue).toNumber());
  }, [token1USDValue, token0USDValue]);
}

export function useV3PoolTVLAndTotalVolume(
  token0: Token | undefined,
  token1: Token | undefined,
  balance0: bigint | number,
  balance1: bigint | number,
  fee: FeeAmount,
  format = true,
) {
  const token0USDPrice = useUSDPrice(token0);
  const token1USDPrice = useUSDPrice(token1);

  const poolKey = useMemo(() => {
    return token0 && token1 && fee
      ? {
          token0: token0.address,
          token1: token1.address,
          fee,
        }
      : undefined;
  }, [token0, token1, fee]);

  const { result: totalVolume } = usePoolTokenAmountsFromKey(poolKey);

  const poolTVL = useMemo(() => {
    if (!token0 || !token1 || !token0USDPrice || !token1USDPrice || !balance0 || !balance1) {
      if (format) {
        return formatDollarAmount(0);
      }
      return 0;
    }

    const token0TVLValue = new BigNumber(token0USDPrice).multipliedBy(balance0.toString());
    const token1TVLValue = new BigNumber(token1USDPrice).multipliedBy(balance1.toString());

    if (format) {
      return formatDollarAmount(new BigNumber(token0TVLValue).plus(token1TVLValue).toNumber());
    }
    return new BigNumber(token0TVLValue).plus(token1TVLValue).toNumber();
  }, [token0, token1, token0USDPrice, token1USDPrice, balance0, balance1]);

  const poolTotalVolumeValue = useMemo(() => {
    if (!token0 || !totalVolume || !token0USDPrice) {
      if (format) {
        return formatDollarAmount(0);
      }
      return 0;
    }

    const token0TotalVolume = new BigNumber(token0USDPrice).multipliedBy(totalVolume.balance0);

    // const token1TotalVolume = token1USDPrice.quote(
    //   CurrencyAmount.fromRawAmount(token1, numberToString(totalVolume.tokenB))
    // );

    // return formatDollarAmount(new BigNumber(token0TotalVolume.toExact()).plus(token1TotalVolume.toExact()).toNumber());
    if (format) {
      return formatDollarAmount(token0TotalVolume.toNumber());
    }
    return new BigNumber(token0TotalVolume).toNumber();
  }, [totalVolume, token0USDPrice, token0]);

  return useMemo(() => {
    return {
      poolTVL,
      poolTotalVolume: poolTotalVolumeValue,
    };
  }, [poolTVL, poolTotalVolumeValue]);
}

interface usePoolTvlV2Props {
  token0: Token | Null;
  token1: Token | Null;
  poolId: string | Null;
}

export function usePoolTvlV2({ token0, token1, poolId }: usePoolTvlV2Props) {
  const { result: balance0 } = useTokenBalance(token0?.address, poolId);
  const { result: balance1 } = useTokenBalance(token1?.address, poolId);

  const amount0 = token0 && balance0 ? CurrencyAmount.fromRawAmount(token0, balance0.toString()) : undefined;
  const amount1 = token1 && balance1 ? CurrencyAmount.fromRawAmount(token1, balance1.toString()) : undefined;

  const token0USDValue = useUSDValue(amount0);
  const token1USDValue = useUSDValue(amount1);

  return useMemo(() => {
    if (!token0USDValue || !token1USDValue) return {};

    return {
      token0Tvl: token0USDValue.toString(),
      token0Balance: balance0?.toString(),
      token1Tvl: token1USDValue.toString(),
      token1Balance: balance1?.toString(),
    };
  }, [token1USDValue, token0USDValue, balance0, balance1]);
}
