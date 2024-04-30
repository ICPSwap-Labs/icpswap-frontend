import { useState, ReactNode } from "react";
import { Grid, Box, Typography, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Transactions from "ui-component/staking-token/Transactions";
import ClaimRecords from "ui-component/staking-token/ClaimRecords";
import MainContainer from "ui-component/MainContainer";
import { MainCard } from "ui-component/index";
import DetailBg from "assets/images/detail_bg.svg";
import { useParams } from "react-router-dom";
import { t } from "@lingui/macro";
import { parseTokenAmount, shorten, explorerLink } from "@icpswap/utils";
import dayjs from "dayjs";
import Copy from "ui-component/copy/copy";
import { useStakingPoolData } from "hooks/staking-token";
import { Theme } from "@mui/material/styles";
import { useTokenBalance } from "hooks/token/useTokenBalance";

const useStyles = makeStyles((theme: Theme) => {
  return {
    details: {
      display: "grid",
      gap: "20px 0",
      gridTemplateColumns: "repeat(2, 1fr)",
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "repeat(2, 1fr)",
      },
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "repeat(1, 1fr)",
      },
    },
  };
});

export function PoolDetailItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Box>
      <Typography fontSize="12px" component="span">
        {label}
      </Typography>{" "}
      <Typography fontSize="12px" component="span" color="text.primary">
        {value}
      </Typography>
    </Box>
  );
}

export function timeFormatter(dateTime: bigint | undefined) {
  return dateTime ? dayjs(Number(dateTime) * 1000).format("YYYY-MM-DD HH:mm:ss") : "--";
}

export default function PoolsDetails() {
  const classes = useStyles();
  const { state, poolId } = useParams<{ poolId: string; state: string }>();
  const [pool] = useStakingPoolData(poolId);

  const [recordType, setRecordType] = useState("transactions");

  const { result: poolTokenBalance } = useTokenBalance(pool?.stakingToken.address, poolId);

  return (
    <MainContainer>
      <Box
        sx={{
          background: `url(${DetailBg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box
          sx={{
            padding: "14px 18px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.06)",
          }}
        >
          <Box
            sx={{
              display: "inline-block",
              padding: "0 17px",
              height: "30px",
              borderRadius: "10px",
              background: "linear-gradient(89.44deg, #5569DB -0.31%, #8572FF 91.14%)",
            }}
          >
            <Grid container alignItems="center" sx={{ height: "100%" }}>
              <Typography color="text.primary">{state ?? "--"}</Typography>
            </Grid>
          </Box>
          <Box mt="30px" className={classes.details}>
            <PoolDetailItem
              label={t`Canister ID:`}
              value={
                <Copy content={poolId ?? ""}>
                  <Typography fontSize="12px" color="text.primary">
                    {shorten(poolId, 8)}
                  </Typography>
                </Copy>
              }
            />
            <PoolDetailItem
              label={t`Pool Balance:`}
              value={
                <Typography fontSize="12px" component="span" color="text.primary">
                  {parseTokenAmount(poolTokenBalance, pool?.stakingTokenDecimals).toFormat()}
                  <Link href={explorerLink(pool?.stakingToken.address ?? "")} target="_blank">
                    &nbsp;{`${pool?.stakingTokenSymbol ?? "--"}`}
                  </Link>
                </Typography>
              }
            />
            <PoolDetailItem
              label={t`Reward Token Amount:`}
              value={
                <Typography fontSize="12px" component="span" color="text.primary">
                  {parseTokenAmount(pool?.rewardDebt, pool?.rewardTokenDecimals).toFormat()}
                  <Link href={explorerLink(pool?.rewardToken.address ?? "")} target="_blank">
                    &nbsp;{`${pool?.rewardTokenSymbol ?? "--"}`}
                  </Link>
                </Typography>
              }
            />

            <PoolDetailItem label={t`Last Reward Time:`} value={timeFormatter(pool?.lastRewardTime)} />
            <PoolDetailItem label={t`End Time:`} value={timeFormatter(pool?.bonusEndTime)} />
          </Box>
        </Box>
      </Box>
      <Box mt="20px">
        <MainCard>
          <Grid>
            <Typography
              color={recordType === "transactions" ? "text.primary" : ""}
              variant="h3"
              onClick={() => setRecordType("transactions")}
              component="span"
              sx={{
                marginRight: "20px",
                cursor: "pointer",
              }}
            >
              Staked Tokens
            </Typography>
            <Typography
              color={recordType !== "transactions" ? "text.primary" : ""}
              variant="h3"
              onClick={() => setRecordType("claimRecords")}
              component="span"
              sx={{
                cursor: "pointer",
              }}
            >
              Reward Tokens
            </Typography>
          </Grid>
          <Grid item container justifyContent="center">
            {recordType === "transactions" ? <Transactions id={poolId} /> : <ClaimRecords id={poolId} />}
          </Grid>
        </MainCard>
      </Box>
    </MainContainer>
  );
}
