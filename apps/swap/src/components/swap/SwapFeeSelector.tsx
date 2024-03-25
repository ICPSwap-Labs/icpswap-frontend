import React, { useState, useMemo, useCallback, memo } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { usePoolsTokenAmountsFromKey } from "hooks/swap/v3Calls";
import { isDarkTheme } from "utils";
import { Trans, t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { BigNumber } from "@icpswap/utils";
import { Token, FeeAmount } from "@icpswap/swap-sdk";

export const FEE_DESCRIPTION = {
  [FeeAmount.LOW]: t`Best for stable pairs`,
  [FeeAmount.MEDIUM]: t`Best for most pairs`,
  [FeeAmount.HIGH]: t`Best for exotic pairs`,
};

const NO_LIQUIDITY = "NO_LIQUIDITY";

export type LOCAL_FEE = {
  feeTier: FeeAmount;
  description: string;
};

const LOCAL_FEES: LOCAL_FEE[] = [
  {
    feeTier: FeeAmount.LOW,
    description: FEE_DESCRIPTION[FeeAmount.LOW],
  },
  {
    feeTier: FeeAmount.MEDIUM,
    description: FEE_DESCRIPTION[FeeAmount.MEDIUM],
  },
  {
    feeTier: FeeAmount.HIGH,
    description: FEE_DESCRIPTION[FeeAmount.HIGH],
  },
];

export const feeFormat = (feeValue: number) => {
  return `${new BigNumber(feeValue).div(10000).toString()}%`;
};

const useStyle = makeStyles((theme: Theme) => {
  const border = "1px solid #29314F";

  return {
    feeItem: {
      padding: "13px 12px",
      border: isDarkTheme(theme) ? border : `1px solid ${theme.colors.lightGray200BorderColor}`,
      borderRadius: "12px",
      cursor: "pointer",
      backgroundColor: isDarkTheme(theme) ? "transparent" : "#fff",
      "&.active": {
        border: `2px solid #5669DC`,
      },
    },
    button: {
      width: "auto",
      padding: "7px 9px",
      backgroundColor: isDarkTheme(theme) ? theme.palette.background.level4 : theme.colors.lightGray200,
      borderRadius: "8px",
      cursor: "pointer",
      outline: "none",
      border: "none",
      color: theme.themeOption.textPrimary,
      [theme.breakpoints.down("sm")]: {
        fontSize: "10px",
      },
    },
    feeButton: {
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        alignItems: "center",
        textAlign: "center",
      },
    },
    activeFee: {
      border: isDarkTheme(theme) ? border : `1px solid ${theme.colors.lightGray200BorderColor}`,
      borderRadius: "12px",
      backgroundColor: isDarkTheme(theme) ? "transparent" : "#fff",
    },
  };
});

export type FeeItem = {
  feeTier: FeeAmount;
  description: string;
  balance0?: BigNumber;
  balance1?: BigNumber;
};

export const FeeItemComponent = memo(
  ({
    fee,
    onClick,
    activeFee,
    getPercentage,
  }: {
    fee: FeeItem;
    onClick: (value: FeeItem) => void;
    activeFee: FeeAmount;
    getPercentage: (value: FeeItem) => string;
  }) => {
    const classes = useStyle();

    const liquidityPercentage = getPercentage(fee);

    return (
      <Box
        className={`${classes.feeItem} ${Number(fee.feeTier) === activeFee ? "active" : ""}`}
        onClick={() => onClick(fee)}
      >
        <Typography variant="h4" color="textPrimary">
          <Trans>{feeFormat(fee.feeTier)} fee</Trans>
        </Typography>
        <Box mt={1}>
          <Typography fontSize="12px" align="left">
            {fee.description}
          </Typography>
        </Box>
        <Box mt={1}>
          <Typography
            className={`${classes.button} ${classes.feeButton}`}
            component="span"
            color="textPrimary"
            fontSize="12px"
          >
            {liquidityPercentage === NO_LIQUIDITY ? t`Not created` : t`${liquidityPercentage} selected`}
          </Typography>
        </Box>
      </Box>
    );
  },
);

export default function SwapFeeSelector({
  currencyA,
  currencyB,
  defaultActiveFee = FeeAmount.MEDIUM,
  onSelect,
}: {
  currencyA: Token | undefined;
  currencyB: Token | undefined;
  defaultActiveFee?: FeeAmount;
  onSelect: (value: FeeAmount) => void;
}) {
  const classes = useStyle();

  const [activeFee] = useState<FeeAmount>(defaultActiveFee);
  // const [feeShow, setFeeToggleShow] = useState(false);

  const feeAmountKeys = useMemo(() => {
    return LOCAL_FEES.map((fee) => {
      if (!currencyA?.address || !currencyB?.address) return undefined;

      return {
        fee: fee.feeTier,
        token0: currencyA.address,
        token1: currencyB.address,
      };
    });
  }, [LOCAL_FEES, currencyA, currencyB]);

  const { result: tvl } = usePoolsTokenAmountsFromKey(feeAmountKeys);

  const fees = useMemo(() => {
    return LOCAL_FEES.map((fee, index) => {
      if (tvl && tvl[index]) {
        return {
          ...tvl[index],
          ...fee,
        };
      }

      return {
        ...fee,
      };
    });
  }, [tvl, LOCAL_FEES]);

  const getFee = (feeValue: FeeAmount) => {
    return fees.filter((fee) => fee.feeTier === feeValue)[0];
  };

  const activeFeeObject = getFee(activeFee);

  // const handleSelectFee = (fee: LOCAL_FEE) => {
  //   setActiveFee(fee.feeTier);
  //   onSelect(fee.feeTier);
  // };

  // const feeToggleShow = () => {
  //   setFeeToggleShow(!feeShow);
  // };

  const totalValueLocked = fees.reduce(
    (accumulator, currentValue) => {
      return [
        new BigNumber(accumulator[0]).plus(currentValue.balance0 ?? 0),
        new BigNumber(accumulator[1]).plus(currentValue.balance1 ?? 0),
      ];
    },
    [new BigNumber(0), new BigNumber(0)],
  );

  const getPercentage = useCallback(
    (fee: FeeItem) => {
      if (!totalValueLocked) return "NO_LIQUIDITY";
      if (new BigNumber(fee.balance0 ?? 0).isEqualTo(0)) return "NO_LIQUIDITY";

      return `${new BigNumber(fee.balance0 ?? 0)
        .plus(fee.balance1 ?? 0)
        .div(new BigNumber(totalValueLocked[0]).plus(totalValueLocked[1]))
        .multipliedBy(100)
        .toFixed(0, 4)}%`;
    },
    [totalValueLocked],
  );

  const currentLiquidityPercentage = getPercentage(activeFeeObject);

  return (
    <>
      <Grid container sx={{ p: 2 }} className={classes.activeFee}>
        <Grid item xs={8}>
          <Typography variant="h4" color="textPrimary">
            <Trans>{feeFormat(activeFeeObject.feeTier)} fee</Trans>
          </Typography>
          <Box mt={1}>
            <Typography className={classes.button} component="span" color="textPrimary" fontSize="12px">
              {currentLiquidityPercentage === NO_LIQUIDITY ? t`Not created` : t`${currentLiquidityPercentage} selected`}
            </Typography>
          </Box>
        </Grid>
        {/* <Grid item xs={4} container justifyContent="flex-end" alignItems="center">
          <button
            className={classes.button}
            component="span"
            color="textPrimary"
            fontSize="12px"
            onClick={feeToggleShow}
          >
            {feeShow ? t`Hide` : t`Edit`}
          </button>
        </Grid> */}
      </Grid>
      {/* {feeShow && (
        <Grid mt={2} container spacing={1}>
          {fees.map((item) => (
            <Grid item xs={4} key={Number(item.feeTier)}>
              <FeeItem
                fee={item}
                activeFee={activeFeeObject.feeTier}
                onClick={handleSelectFee}
                getPercentage={getPercentage}
              />
            </Grid>
          ))}
        </Grid>
      )} */}
    </>
  );
}
