import { useCallback, useEffect, useMemo, useState } from "react";
import { parseTokenAmount, formatDollarAmount } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { useInfoAllTokens, useFarms, useInterval, useFarmTotalAmount } from "@icpswap/hooks";
import { getTokenInfo } from "hooks/token/index";

interface GlobalData {
  stakeTokenTVL: string;
  rewardTokenTVL: string;
}

export function useFarmGlobalData() {
  const [poolsNumber, setPoolsNumber] = useState<null | number>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stakedTokenTVL, setStakedTokenTVL] = useState("0");
  const [rewardedTokenTVL, setRewardedTokenTVL] = useState("0");

  const { result: allFarms } = useFarms(undefined, refreshTrigger);
  const { result: allLiveFarms } = useFarms("LIVE", refreshTrigger);
  const { result: allFinishedFarms } = useFarms("FINISHED", refreshTrigger);
  const { result: allClosedFarms } = useFarms("CLOSED", refreshTrigger);
  const { result: farmTotalAmount } = useFarmTotalAmount();

  const [data, setData] = useState<GlobalData>({
    stakeTokenTVL: "0",
    rewardTokenTVL: "0",
  });

  const infoAllTokens = useInfoAllTokens();

  useMemo(() => {
    async function call() {
      if (allLiveFarms && infoAllTokens && infoAllTokens.length > 0) {
        let stakedTVL = new BigNumber(0);
        let rewardTVL = new BigNumber(0);

        for (let i = 0; i < allLiveFarms.length; i++) {
          const farm = allLiveFarms[i];

          const { poolToken0, poolToken1, rewardToken } = farm[1];

          const token0Price = infoAllTokens.find((token) => token.address === poolToken0.address)?.priceUSD;
          const token1Price = infoAllTokens.find((token) => token.address === poolToken1.address)?.priceUSD;
          const rewardTokenPrice = infoAllTokens.find((token) => token.address === rewardToken.address)?.priceUSD;

          const token0Info = await getTokenInfo(poolToken0.address);
          const token1Info = await getTokenInfo(poolToken1.address);
          const rewardTokenInfo = await getTokenInfo(rewardToken.address);

          if (!token0Price || !token1Price || !rewardTokenPrice || !token0Info || !token1Info || !rewardTokenInfo) {
            stakedTVL = stakedTVL.plus(0);
            rewardTVL = rewardTVL.plus(0);
          } else {
            const stakedToken0TVL = parseTokenAmount(poolToken0.amount, token0Info.decimals).multipliedBy(token0Price);
            const stakedToken1TVL = parseTokenAmount(poolToken1.amount, token1Info.decimals).multipliedBy(token1Price);
            const rewardTokenTVL = parseTokenAmount(rewardToken.amount, rewardTokenInfo.decimals).multipliedBy(
              rewardTokenPrice,
            );

            stakedTVL = stakedTVL.plus(stakedToken0TVL).plus(stakedToken1TVL);
            rewardTVL = rewardTVL.plus(rewardTokenTVL);
          }
        }

        setData({
          stakeTokenTVL: formatDollarAmount(stakedTVL.toFixed(4)),
          rewardTokenTVL: formatDollarAmount(rewardTVL.toFixed(4)),
        });
      }
    }

    call();
  }, [infoAllTokens, allLiveFarms]);

  useMemo(() => {
    async function call() {
      if (allClosedFarms && allFinishedFarms && infoAllTokens && infoAllTokens.length > 0) {
        const allFarms = [...allClosedFarms, ...allFinishedFarms];

        let stakedTVL = new BigNumber(0);
        let rewardTVL = new BigNumber(0);

        for (let i = 0; i < allFarms.length; i++) {
          const farm = allFarms[i];

          const { poolToken0, poolToken1, rewardToken } = farm[1];

          const token0Price = infoAllTokens.find((token) => token.address === poolToken0.address)?.priceUSD;
          const token1Price = infoAllTokens.find((token) => token.address === poolToken1.address)?.priceUSD;
          const rewardTokenPrice = infoAllTokens.find((token) => token.address === rewardToken.address)?.priceUSD;

          const token0Info = await getTokenInfo(poolToken0.address);
          const token1Info = await getTokenInfo(poolToken1.address);
          const rewardTokenInfo = await getTokenInfo(rewardToken.address);

          if (!token0Price || !token1Price || !rewardTokenPrice || !token0Info || !token1Info || !rewardTokenInfo) {
            stakedTVL = stakedTVL.plus(0);
            rewardTVL = rewardTVL.plus(0);
          } else {
            const stakedToken0TVL = parseTokenAmount(poolToken0.amount, token0Info.decimals).multipliedBy(token0Price);
            const stakedToken1TVL = parseTokenAmount(poolToken1.amount, token1Info.decimals).multipliedBy(token1Price);
            const rewardTokenTVL = parseTokenAmount(rewardToken.amount, rewardTokenInfo.decimals).multipliedBy(
              rewardTokenPrice,
            );

            stakedTVL = stakedTVL.plus(stakedToken0TVL).plus(stakedToken1TVL);
            rewardTVL = rewardTVL.plus(rewardTokenTVL);
          }
        }

        setRewardedTokenTVL(formatDollarAmount(rewardTVL.toFixed(4)));
        setStakedTokenTVL(formatDollarAmount(stakedTVL.toFixed(4)));
      }
    }

    call();
  }, [infoAllTokens, allClosedFarms, allFinishedFarms]);

  useEffect(() => {
    if (allFarms) {
      setPoolsNumber(allFarms.length);
    }
  }, [allFarms]);

  const update = useCallback(async () => {
    setRefreshTrigger((prevState) => prevState + 1);
  }, []);

  useInterval<void>(update);

  return useMemo(
    () => ({ ...data, poolsNumber, rewardedTokenTVL, stakedTokenTVL, ...farmTotalAmount }),
    [data, poolsNumber, rewardedTokenTVL, stakedTokenTVL, farmTotalAmount],
  );
}
