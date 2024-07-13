import { useCallback, useMemo, useState } from "react";
import { useFarmsByState, useInfoAllTokens, useInterval } from "@icpswap/hooks";
import { formatDollarAmount, parseTokenAmount } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { getTokenInfo } from "hooks/token/index";

type GlobalData = { stakeTokenTVL: string; rewardTokenTVL: string };

export function useFarmGlobalTVL() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { result: allLiveFarms } = useFarmsByState("LIVE", refreshTrigger);

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

  const update = useCallback(async () => {
    setRefreshTrigger((prevState) => prevState + 1);
  }, []);

  useInterval<void>(update);

  return useMemo(() => data, [data]);
}
