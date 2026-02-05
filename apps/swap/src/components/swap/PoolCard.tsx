import { useCallback } from "react";
import { Box, Grid, Typography, makeStyles, Theme } from "components/Mui";
import { CurrenciesAvatar } from "components/CurrenciesAvatar";
import { useToken } from "hooks/useCurrency";
import { feeAmountToPercentage } from "utils/swap/index";
import { useNavigate } from "react-router-dom";
import { formatDollarAmount } from "@icpswap/utils";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => {
  return {
    topBox: {
      clear: "both",
      overflow: "hidden",
    },
    floatLeft: {
      float: "left",
    },
    listItem: {
      height: "140px",
      padding: "18px",
      borderRadius: `${theme.radius}px`,
      cursor: "pointer",
    },
    poolName: {
      margin: "0 8px",
      "& .MuiTypography-root": {
        color: "#fff",
        fontWeight: 700,
      },
    },
    feeAmount: {
      padding: "2px 4px",
      borderRadius: "4px",
      "& .MuiTypography-root": {
        color: "#fff",
      },
    },
    poolData: {
      marginTop: "28px",
    },
  };
});

export interface PoolCardProps {
  token0: string;
  token1: string;
  fee: bigint;
  tvlUSD: string | number;
  totalVolumeUSD: string | number;
  token0Symbol?: string;
  token1Symbol?: string;
}

export default function PoolCard({
  token0,
  token1,
  fee,
  totalVolumeUSD,
  tvlUSD,
  token0Symbol,
  token1Symbol,
}: PoolCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classes = useStyles();

  const [, currency0] = useToken(token0);
  const [, currency1] = useToken(token1);

  const handlePoolClick = useCallback(() => {
    navigate(`/liquidity/add/${token0}/${token1}/${Number(fee)}`);
  }, [navigate]);

  return (
    <Box className={`${classes.listItem} list-item`} onClick={handlePoolClick}>
      <Box className="list-item-color-box" />
      <Grid container alignItems="center" className={`${classes.topBox}`}>
        <CurrenciesAvatar
          className={classes.floatLeft}
          currencyA={currency0}
          currencyB={currency1}
          borderColor="transparent"
          bgColor="transparent"
        />
        <Box className={`${classes.poolName} ${classes.floatLeft}`}>
          <Typography>{`${token0Symbol ?? currency0?.symbol ?? "--"}/${
            token1Symbol ?? currency1?.symbol ?? "--"
          }`}</Typography>
        </Box>
        <Box className={`${classes.feeAmount} feeAmount ${classes.floatLeft}`}>
          <Typography>{feeAmountToPercentage(Number(fee))}</Typography>
        </Box>
      </Grid>
      <Grid container className={classes.poolData}>
        <Grid container flexDirection="column" item xs={6}>
          <Grid item container justifyContent="flex-start">
            <Typography className="title">{t("common.tvl")}</Typography>
          </Grid>
          <Grid item mt={1} container justifyContent="flex-start">
            <Typography className="value" color="#ffffff" fontWeight={700} fontSize={16}>
              {formatDollarAmount(tvlUSD)}
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={6} flexDirection="column" justifyContent="flex-end">
          <Grid item container justifyContent="flex-end">
            <Typography className="title">{t("common.total.volume")}</Typography>
          </Grid>
          <Grid mt={1} item container justifyContent="flex-end">
            <Typography className="value" color="#ffffff" fontWeight={700} fontSize={16}>
              {formatDollarAmount(totalVolumeUSD)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
