import { useState, ReactNode } from "react";
import { makeStyles, Grid, Box, Typography, Link, Theme } from "components/Mui";
import { StakeClaimTransactions, StakeTransactions } from "components/info/stake";
import { MainCard, InfoWrapper, Copy } from "components/index";
import { useParams } from "react-router-dom";
import { parseTokenAmount, shorten, explorerLink, cycleValueFormat } from "@icpswap/utils";
import { useStakingPoolCycles, useStakingPoolState, useStakingTokenPool } from "@icpswap/hooks";
import { BreadcrumbsV1 } from "@icpswap/ui";
import dayjs from "dayjs";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useToken } from "hooks/index";
import upperFirst from "lodash/upperFirst";
import { useTranslation } from "react-i18next";

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
      <Typography component="span">{label}</Typography>{" "}
      <Typography component="span" color="text.primary">
        {value}
      </Typography>
    </Box>
  );
}

export function timeFormatter(dateTime: bigint | undefined) {
  return dateTime ? dayjs(Number(dateTime) * 1000).format("YYYY-MM-DD HH:mm:ss") : "--";
}

export default function PoolsDetails() {
  const { t } = useTranslation();
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const { result: pool } = useStakingTokenPool(id);

  const [recordType, setRecordType] = useState("transactions");

  const { result: cycles } = useStakingPoolCycles(id);
  const { result: poolTokenBalance } = useTokenBalance(pool?.stakingToken.address, id);
  const [, rewardToken] = useToken(pool?.rewardToken.address);

  const state = useStakingPoolState(pool);

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1 links={[{ label: t("common.stake"), link: "/info-stake" }, { label: t("stake.details") }]} />

      <Box
        sx={{
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
              <Typography color="text.primary">
                {state ? (state === "NOT_STARTED" ? "Unstart" : upperFirst(state.toLocaleLowerCase())) : "--"}
              </Typography>
            </Grid>
          </Box>
          <Box mt="30px" className={classes.details}>
            <PoolDetailItem
              label={t("common.canister.id.colon")}
              value={
                <Copy content={id ?? ""}>
                  <Typography color="text.primary">{shorten(id, 8)}</Typography>
                </Copy>
              }
            />
            <PoolDetailItem
              label={t`Pool Balance:`}
              value={
                poolTokenBalance && pool ? (
                  <Typography component="span" color="text.primary">
                    {parseTokenAmount(poolTokenBalance, pool.stakingTokenDecimals).toFormat()}
                    <Link href={explorerLink(pool.stakingToken.address)} target="_blank">
                      &nbsp;{`${pool.stakingTokenSymbol}`}
                    </Link>
                  </Typography>
                ) : (
                  "--"
                )
              }
            />
            <PoolDetailItem
              label={t`Total Rewards:`}
              value={
                <Typography component="span" color="text.primary">
                  {parseTokenAmount(pool?.rewardDebt, pool?.rewardTokenDecimals).toFormat()}
                  <Link href={explorerLink(pool?.rewardToken.address ?? "")} target="_blank">
                    &nbsp;{`${pool?.rewardTokenSymbol ?? "--"}`}
                  </Link>
                </Typography>
              }
            />
            <PoolDetailItem
              label={t`Reward Per Second:`}
              value={
                <>
                  {pool && rewardToken
                    ? parseTokenAmount(pool.rewardPerTime.toString(), rewardToken.decimals).toFormat()
                    : "--"}
                  <Link href={explorerLink(pool?.rewardToken.address ?? "")} target="_blank">
                    &nbsp;{`${pool?.rewardTokenSymbol ?? "--"}`}
                  </Link>
                </>
              }
            />
            <PoolDetailItem label={t`Start Time:`} value={timeFormatter(pool?.startTime)} />
            <PoolDetailItem label={t`End Time:`} value={timeFormatter(pool?.bonusEndTime)} />
            <PoolDetailItem label={t`Last Reward Time:`} value={timeFormatter(pool?.lastRewardTime)} />
            <PoolDetailItem
              label={t("common.creator.colon")}
              value={
                pool ? (
                  <Link href={explorerLink(pool.creator.toString())} target="_blank">
                    {shorten(pool.creator.toString(), 8)}
                  </Link>
                ) : (
                  "--"
                )
              }
            />
            <PoolDetailItem
              label={t`Cycles Left:`}
              value={cycles?.balance ? cycleValueFormat(cycles?.balance) : "--"}
            />
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
              {t("stake.tokens")}
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
              {t("common.reward.tokens")}
            </Typography>
          </Grid>
          <Grid item container justifyContent="center" mt="20px">
            {recordType === "transactions" ? <StakeTransactions id={id} /> : <StakeClaimTransactions id={id} />}
          </Grid>
        </MainCard>
      </Box>
    </InfoWrapper>
  );
}
