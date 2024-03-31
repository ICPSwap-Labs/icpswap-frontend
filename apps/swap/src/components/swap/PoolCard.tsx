import { useCallback } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CurrenciesAvatar from "components/CurrenciesAvatar";
import { useToken } from "hooks/useCurrency";
import { feeAmountToPercentage } from "utils/swap/index";
import { useHistory } from "react-router-dom";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { formatDollarAmount } from "@icpswap/utils";

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
  version?: "v2" | "v3";
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
  version,
}: PoolCardProps) {
  const history = useHistory();
  const classes = useStyles();

  const [, currency0] = useToken(token0);
  const [, currency1] = useToken(token1);

  const handlePoolClick = useCallback(() => {
    if (version === "v2") {
      history.push(`/swap/v2/liquidity/add/${token0}/${token1}/${Number(fee)}`);
    } else {
      history.push(`/swap/liquidity/add/${token0}/${token1}/${Number(fee)}`);
    }
  }, [history]);

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
            <Typography className="title">
              <Trans>TVL</Trans>
            </Typography>
          </Grid>
          <Grid item mt={1} container justifyContent="flex-start">
            <Typography className="value" color="#ffffff" fontWeight={700} fontSize={16}>
              {formatDollarAmount(tvlUSD)}
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={6} flexDirection="column" justifyContent="flex-end">
          <Grid item container justifyContent="flex-end">
            <Typography className="title">
              <Trans>Total Volume</Trans>
            </Typography>
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
