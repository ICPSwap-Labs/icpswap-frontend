import { useMemo } from "react";
import { Box, makeStyles, Theme } from "components/Mui";
import { isDarkTheme } from "utils/index";
import PoolCard from "components/swap/PoolCard";
import { useAllPoolsTVL, useNodeInfoAllPools } from "@icpswap/hooks";
import { LoadingRow } from "components/index";

const useStyles = makeStyles((theme: Theme) => {
  const bgOpacity = isDarkTheme(theme) ? "0.34" : "0.7";

  return {
    wrapper: {
      display: "grid",
      gap: "0 20px",
      gridTemplateColumns: "repeat(4, 1fr)",
      overflow: "hidden",
      width: "100%",
      "@media (max-width:1140px)": {
        gridGap: "10px 10px",
        gridTemplateColumns: "1fr 1fr",
      },
      "@media (max-width:640px)": {
        gridGap: "10px 0",
        gridTemplateColumns: "1fr",
      },
      "& .title": {
        color: "rgba(255, 255, 255, 0.6)",
      },
      "& .value": {
        color: "#ffffff",
      },
    },
    listWrapper: {
      "& .list-item": {
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.04)",
      },
      "& .list-item-color-box": {
        position: "absolute",
        left: "10px",
        bottom: "7px",
        width: "98px",
        height: "98px",
        filter: "blur(34px)",
        zIndex: "-1",
      },
      "&:first-child": {
        "& .list-item": {
          background: `rgba(80, 95, 186, ${bgOpacity})`,
        },
        "& .list-item-color-box": {
          background: "#3644C2",
        },
        "& .feeAmount": {
          background: "#4D5CA9",
        },
      },
      "&:nth-of-type(2)": {
        "& .list-item": {
          background: `rgba(101, 80, 186, ${bgOpacity})`,
        },
        "& .list-item-color-box": {
          background: "#5D0A9E",
        },
        "& .feeAmount": {
          background: "#654DA9",
        },
      },
      "&:nth-of-type(3)": {
        "& .list-item": {
          background: `rgba(45, 148, 243, ${bgOpacity})`,
        },
        "& .list-item-color-box": {
          background: "#0A609E",
        },
        "& .feeAmount": {
          background: "#2D94F3",
        },
      },
      "&:nth-of-type(4)": {
        "& .list-item": {
          background: `rgba(162, 88, 145, ${bgOpacity})`,
        },
        "& .list-item-color-box": {
          background: "#9E0A8F",
        },
        "& .feeAmount": {
          background: "#833780",
        },
      },
    },
  };
});

export default function PoolList() {
  const classes = useStyles();

  const { result: pools, loading } = useNodeInfoAllPools();
  const { result: allPoolsTVL, loading: tvlLoading } = useAllPoolsTVL();

  const poolList = useMemo(() => {
    if (!pools || !allPoolsTVL) return [];

    return pools
      .sort((a, b) => {
        if (a.totalVolumeUSD > b.totalVolumeUSD) {
          return -1;
        }
        return 1;
      })
      .filter((pool) => pool.poolFee === 3000)
      .slice(0, 4)
      .map((pool) => {
        const tvlUSD = allPoolsTVL.find((poolTVL) => poolTVL[0] === pool.poolId);
        return { ...pool, tvlUSD: tvlUSD ? tvlUSD[1] : 0 };
      });
  }, [pools, allPoolsTVL]);

  return loading || tvlLoading ? (
    <LoadingRow>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </LoadingRow>
  ) : (
    <Box className={classes.wrapper}>
      {poolList.map((pool, index) => (
        <Box className={classes.listWrapper} key={index}>
          <PoolCard
            token0={pool.token0LedgerId}
            token1={pool.token1LedgerId}
            fee={BigInt(pool.poolFee)}
            token0Symbol={pool.token0Symbol}
            token1Symbol={pool.token1Symbol}
            tvlUSD={pool.tvlUSD}
            totalVolumeUSD={pool.totalVolumeUSD}
          />
        </Box>
      ))}
    </Box>
  );
}
