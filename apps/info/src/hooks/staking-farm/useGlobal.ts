import { useCallback, useMemo, useState } from "react";
import { useInfoAllTokens, useInterval, useFarmRewardInfos, useFarmTotalAmount } from "@icpswap/hooks";
import { formatDollarAmount, parseTokenAmount } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { getTokenInfo } from "hooks/token/index";

type GlobalData = { stakeTokenTVL: string; rewardTokenTVL: string };

export function useFarmGlobalData() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { result: farmTotalAmount } = useFarmTotalAmount();
  const { result: allLiveFarmsInfos } = useFarmRewardInfos("LIVE", refreshTrigger);

  const [data, setData] = useState<GlobalData>({
    stakeTokenTVL: "0",
    rewardTokenTVL: "0",
  });

  const infoAllTokens = useInfoAllTokens();

  useMemo(() => {
    async function call() {
      if (allLiveFarmsInfos && infoAllTokens && infoAllTokens.length > 0) {
        let stakedTVL = new BigNumber(0);
        let rewardTVL = new BigNumber(0);

        for (let i = 0; i < allLiveFarmsInfos.length; i++) {
          const farmInfo = allLiveFarmsInfos[i];

          const { poolToken0TVL, poolToken1TVL, totalReward } = farmInfo[1];

          const { address: token0Principal, amount: token0Amount } = poolToken0TVL;
          const { address: token1Principal, amount: token1Amount } = poolToken1TVL;
          const { address: rewardTokenPrincipal, amount: rewardAmount } = totalReward;

          const token0Price = infoAllTokens.find((token) => token.address === token0Principal.toString())?.priceUSD;
          const token1Price = infoAllTokens.find((token) => token.address === token1Principal.toString())?.priceUSD;
          const rewardTokenPrice = infoAllTokens.find((token) => token.address === rewardTokenPrincipal.toString())
            ?.priceUSD;

          const token0Info = await getTokenInfo(token0Principal.toString());
          const token1Info = await getTokenInfo(token1Principal.toString());
          const rewardTokenInfo = await getTokenInfo(rewardTokenPrincipal.toString());

          if (!token0Price || !token1Price || !rewardTokenPrice || !token0Info || !token1Info || !rewardTokenInfo) {
            stakedTVL = stakedTVL.plus(0);
            rewardTVL = rewardTVL.plus(0);
          } else {
            const stakedToken0TVL = parseTokenAmount(token0Amount, token0Info.decimals).multipliedBy(token0Price);
            const stakedToken1TVL = parseTokenAmount(token1Amount, token1Info.decimals).multipliedBy(token1Price);
            const rewardTokenTVL = parseTokenAmount(rewardAmount, rewardTokenInfo.decimals).multipliedBy(
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
  }, [infoAllTokens, allLiveFarmsInfos]);

  const update = useCallback(async () => {
    setRefreshTrigger((prevState) => prevState + 1);
  }, []);

  useInterval<void>(update);

  return useMemo(
    () => ({ ...data, farmAmount: farmTotalAmount?.farmAmount, principalAmount: farmTotalAmount?.principalAmount }),
    [data, farmTotalAmount],
  );
}
