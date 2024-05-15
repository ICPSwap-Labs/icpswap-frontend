import { useState, ReactNode } from "react";
import { Grid, Box, Typography, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Transactions from "ui-component/staking-farm/Transactions";
import ClaimRecords from "ui-component/staking-farm/ClaimRecords";
import MainContainer from "ui-component/MainContainer";
import DetailBg from "assets/images/detail_bg.svg";
import { useParams } from "react-router-dom";
import { t, Trans } from "@lingui/macro";
import { parseTokenAmount, shorten } from "@icpswap/utils";
import { getFarmPoolStatus } from "utils/farms/index";
import dayjs from "dayjs";
import Copy from "ui-component/copy/copy";
import { getExplorerPrincipalLink } from "utils";
import { useV3UserFarmInfo } from "@icpswap/hooks";
import { Theme } from "@mui/material/styles";
import { AnonymousPrincipal } from "@icpswap/constants";
import { MainCard } from "@icpswap/ui";
import { useTokenInfo } from "hooks/token";

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

export function PoolDetailItem({ label, value }: { value: ReactNode; label: ReactNode }) {
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

export default function FarmDetails() {
  const classes = useStyles();
  const { farmId } = useParams<{ farmId: string }>();
  const { result: farmInfo } = useV3UserFarmInfo(farmId, AnonymousPrincipal);
  const { statusText } = getFarmPoolStatus(farmInfo) ?? { statusText: "" };

  const [recordType, setRecordType] = useState("transactions");

  const { result: rewardToken } = useTokenInfo(farmInfo?.rewardToken.address);

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
              <Typography color="text.primary">{statusText}</Typography>
            </Grid>
          </Box>
          <Box mt="30px" className={classes.details}>
            <PoolDetailItem
              label={t`Canister ID:`}
              value={
                <Copy content={farmId}>
                  <Typography fontSize="12px" color="text.primary">
                    {shorten(farmId, 8)}
                  </Typography>
                </Copy>
              }
            />
            <PoolDetailItem label={t`Staking Positions Amount:`} value={String(farmInfo?.numberOfStakes ?? 0)} />
            <PoolDetailItem
              label={t`Reward Token Amount:`}
              value={
                <Typography fontSize="12px" component="span" color="text.primary">
                  {parseTokenAmount(farmInfo?.totalReward, rewardToken?.decimals).toFormat()}
                  <Link href={getExplorerPrincipalLink(farmInfo?.rewardToken.address ?? "")} target="_blank">
                    &nbsp;{`${rewardToken?.symbol ?? "--"}`}
                  </Link>
                </Typography>
              }
            />
            <PoolDetailItem label={t`Start Time:`} value={timeFormatter(farmInfo?.startTime)} />
            <PoolDetailItem label={t`End Time:`} value={timeFormatter(farmInfo?.endTime)} />
            <PoolDetailItem
              label={t`Creator:`}
              value={
                <Copy content={farmInfo?.creator.toString() ?? ""}>
                  <Typography fontSize="12px" color="text.primary">
                    {shorten(farmInfo?.creator.toString() ?? "", 8)}
                  </Typography>
                </Copy>
              }
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
              <Trans>Position(LP) NFTs</Trans>
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
              <Trans>Reward Tokens</Trans>
            </Typography>
          </Grid>
          <Grid item container justifyContent="center">
            {recordType === "transactions" ? (
              <Transactions id={farmId} rewardTokenId={farmInfo?.rewardToken.address} />
            ) : (
              <ClaimRecords id={farmId} rewardTokenId={farmInfo?.rewardToken.address} />
            )}
          </Grid>
        </MainCard>
      </Box>
    </MainContainer>
  );
}
