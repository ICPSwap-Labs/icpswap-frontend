import { useState, ReactNode } from "react";
import { Grid, Box, Typography, Link, makeStyles } from "components/Mui";
import { Copy, InfoWrapper } from "components/index";
import { FarmClaimTransactions, FarmTransactions } from "components/info/farm";
import { useParams } from "react-router-dom";
import {
  parseTokenAmount,
  shorten,
  explorerLink,
  toSignificantWithGroupSeparator,
  cycleValueFormat,
} from "@icpswap/utils";
import dayjs from "dayjs";
import { useUserFarmInfo, useV3FarmRewardMetadata, useFarmCycles, useFarmState } from "@icpswap/hooks";
import { AnonymousPrincipal } from "@icpswap/constants";
import { MainCard, BreadcrumbsV1 } from "@icpswap/ui";
import { useToken } from "hooks/index";
import upperFirst from "lodash/upperFirst";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    details: {
      display: "flex",
      gap: "20px 0",
      "& .columns": {
        flex: "50%",
        display: "flex",
        flexDirection: "column",
        gap: "20px 0",
      },
      "@media(max-width: 640px)": {
        flexDirection: "column",

        "& .columns": {
          flex: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px 0",
        },
      },
    },
  };
});

export function PoolDetailItem({ label, value }: { value: ReactNode; label: ReactNode }) {
  return (
    <Box className="row-item">
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

export default function FarmDetails() {
  const { t } = useTranslation();
  const classes = useStyles();
  const { id: farmId } = useParams() as { id: string };
  const { result: farmInfo } = useUserFarmInfo(farmId, AnonymousPrincipal);
  const { result: farmMetadata } = useV3FarmRewardMetadata(farmId);
  const { result: cycles } = useFarmCycles(farmId);

  const state = useFarmState(farmInfo);

  const [recordType, setRecordType] = useState("transactions");

  const [, rewardToken] = useToken(farmInfo?.rewardToken.address);

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1 links={[{ label: t("common.farm"), link: "/info-farm" }, { label: t("farm.details") }]} />

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
            <Box className="columns">
              <PoolDetailItem
                label={t("common.canister.id.colon")}
                value={
                  <Copy content={farmId}>
                    <Typography color="text.primary">{shorten(farmId, 8)}</Typography>
                  </Copy>
                }
              />
              <PoolDetailItem
                label={t("info.farm.staking.positions.amount")}
                value={String(farmInfo?.numberOfStakes ?? 0)}
              />
              <PoolDetailItem
                label={t("info.farm.reward.token.amount")}
                value={
                  <Typography component="span" color="text.primary">
                    {parseTokenAmount(farmInfo?.totalReward, rewardToken?.decimals).toFormat()}
                    <Link href={explorerLink(farmInfo?.rewardToken.address ?? "")} target="_blank">
                      &nbsp;{`${rewardToken?.symbol ?? "--"}`}
                    </Link>
                  </Typography>
                }
              />
              <PoolDetailItem
                label={t("info.farm.claimed.rewards.colon")}
                value={
                  farmMetadata && rewardToken ? (
                    <>
                      {toSignificantWithGroupSeparator(
                        parseTokenAmount(farmMetadata.totalRewardHarvested.toString(), rewardToken.decimals).toString(),
                        8,
                      )}
                      <Link href={explorerLink(farmInfo?.rewardToken.address ?? "")} target="_blank">
                        &nbsp;{rewardToken.symbol}
                      </Link>
                    </>
                  ) : (
                    "--"
                  )
                }
              />
              <PoolDetailItem
                label={t("common.unclaimed.rewards.colon")}
                value={
                  farmMetadata && rewardToken ? (
                    <>
                      {toSignificantWithGroupSeparator(
                        parseTokenAmount(
                          farmMetadata.totalRewardUnharvested.toString(),
                          rewardToken.decimals,
                        ).toString(),
                        8,
                      )}
                      <Link href={explorerLink(farmInfo?.rewardToken.address ?? "")} target="_blank">
                        &nbsp;{rewardToken.symbol}
                      </Link>
                    </>
                  ) : (
                    "--"
                  )
                }
              />
              <PoolDetailItem
                label={t("farm.distribution.interval.colon")}
                value={
                  farmMetadata ? (
                    <>
                      {Number(farmMetadata?.secondPerCycle ?? 0) / 60} {t("common.min")}
                    </>
                  ) : (
                    "--"
                  )
                }
              />
            </Box>

            <Box className="columns">
              <PoolDetailItem
                label={t("info.farm.amount.distribution.colon")}
                value={
                  farmMetadata && rewardToken ? (
                    <>
                      {toSignificantWithGroupSeparator(
                        parseTokenAmount(farmMetadata.rewardPerCycle, rewardToken.decimals).toString(),
                        8,
                      )}
                      <Link href={explorerLink(farmInfo?.rewardToken.address ?? "")} target="_blank">
                        &nbsp;{rewardToken.symbol}
                      </Link>
                    </>
                  ) : (
                    "--"
                  )
                }
              />
              <PoolDetailItem label={t("common.start.time.colon")} value={timeFormatter(farmInfo?.startTime)} />
              <PoolDetailItem label={t("common.end.time.colon")} value={timeFormatter(farmInfo?.endTime)} />
              <PoolDetailItem
                label={t("common.creator.colon")}
                value={
                  <Copy content={farmInfo?.creator.toString() ?? ""}>
                    <Typography color="text.primary">{shorten(farmInfo?.creator.toString() ?? "", 8)}</Typography>
                  </Copy>
                }
              />
              <PoolDetailItem
                label={t("common.cycles.left.colon")}
                value={cycles?.balance ? cycleValueFormat(cycles?.balance) : "--"}
              />
            </Box>
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
              {t("liquidity.staked.positions")}
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
            {recordType === "transactions" ? (
              <FarmTransactions id={farmId} rewardTokenId={farmInfo?.rewardToken.address} />
            ) : (
              <FarmClaimTransactions id={farmId} rewardTokenId={farmInfo?.rewardToken.address} />
            )}
          </Grid>
        </MainCard>
      </Box>
    </InfoWrapper>
  );
}
