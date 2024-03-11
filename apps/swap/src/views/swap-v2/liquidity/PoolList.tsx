import { useMemo } from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useFourListedPools } from "hooks/swap/v2/useSwapCalls";
import { isDarkTheme } from "utils/index";
import { Theme } from "@mui/material/styles";
import LoadingRow from "components/Loading/LoadingRow";
import PoolCard from "components/swap/PoolCard";

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
    topBox: {
      clear: "both",
      overflow: "hidden",
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
      "&:nth-child(2)": {
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
      "&:nth-child(3)": {
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
      "&:nth-child(4)": {
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

  const { result: pools, loading } = useFourListedPools();

  const poolList = useMemo(() => {
    if (!pools) return [];

    return pools
      .filter((pool) => {
        return pool.tvlUSD !== Infinity && pool.totalVolumeUSD !== Infinity;
      })
      .sort((a, b) => {
        if (a.totalVolumeUSD > b.totalVolumeUSD) {
          return -1;
        }
        return 1;
      })
      .filter((pool) => pool.feeTier === BigInt(3000))
      .slice(0, 4);
  }, [pools]);

  return loading ? (
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
            token0={pool.token0Id}
            token1={pool.token1Id}
            token0Symbol={pool.token0Symbol}
            token1Symbol={pool.token1Symbol}
            tvlUSD={pool.tvlUSD}
            totalVolumeUSD={pool.totalVolumeUSD}
            fee={pool.feeTier}
            version="v2"
          />
        </Box>
      ))}
    </Box>
  );
}
