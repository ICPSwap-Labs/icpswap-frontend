import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Grid, Box, makeStyles, Theme } from "components/Mui";
import { Flex, Select } from "@icpswap/ui";
import { useAccountPrincipal } from "store/auth/hooks";
import { FilledTextField, Wrapper, MainCard, NumberFilledTextField, AuthButton } from "components/index";
import { useTips } from "hooks/useTips";
import Identity, { CallbackProps } from "components/Identity";
import { formatTokenAmount } from "@icpswap/utils";
import { createV3Farm, useSwapPoolMetadata } from "@icpswap/hooks";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";
import { type ActorIdentity, ResultStatus } from "@icpswap/types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { timeParser } from "utils/index";
import { useToken } from "hooks/index";
import { useUpdateTokenStandard } from "store/token/cache/hooks";
import { getSwapTokenArgs } from "hooks/token/index";
import dayjs from "dayjs";
import { FarmControllerId } from "constants/canister";
import { standardCheck } from "utils/token/standardCheck";
import { Principal } from "@dfinity/principal";
import { useTranslation } from "react-i18next";

export const TokenStandards = [
  { label: "EXT", value: TOKEN_STANDARD.EXT },
  { label: "DIP20", value: TOKEN_STANDARD.DIP20 },
  { label: "ICRC1", value: TOKEN_STANDARD.ICRC1 },
  { label: "ICRC2", value: TOKEN_STANDARD.ICRC2 },
  { label: "ICP", value: TOKEN_STANDARD.ICP },
];

const useStyles = makeStyles((theme: Theme) => {
  return {
    breadcrumbs: {
      padding: "0 0 25px 16px",
      "& a": {
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
    nftDesc: {
      color: theme.palette.primary[`400`],
    },
    mintInfoBox: {
      display: "grid",
      gap: "30px 0",
      gridTemplateColumns: "1fr",
      gridAutoFlow: "row",
    },
    uploadImage: {
      height: "180px",
    },
  };
});

type Values = {
  rewardToken: string;
  rewardTokenSymbol: string;
  rewardTokenDecimals: number;
  rewardTokenFee: number;
  rewardStandard: string;
  pool: string;
  startDateTime: Date;
  endDateTime: Date;
  reward?: number;
  token0AmountLimit: number;
  token1AmountLimit: number;
  priceInsideLimit: string;
  secondPerCycle: number;
  refunder: string;
};

const DefaultValue = {
  startDateTime: new Date(new Date().getTime() + 10 * 60 * 1000),
  endDateTime: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
  token0AmountLimit: 0,
  token1AmountLimit: 0,
  secondPerCycle: 600,
} as Values;

export default function CreateProject() {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const principal = useAccountPrincipal();
  const [values, setValues] = useState<Values>(DefaultValue);
  const [openTip] = useTips();
  const [loading, setLoading] = useState(false);
  const [tokenId, setTokenId] = useState<string | undefined>(undefined);

  const updateTokenStandard = useUpdateTokenStandard();

  const handleFieldChange = (value: string | number | Date, field: string) => {
    if (field === "rewardStandard" || field === "rewardToken") {
      if (values.rewardToken && values.rewardStandard) {
        updateTokenStandard([
          {
            canisterId: values.rewardToken,
            standard: values.rewardStandard as TOKEN_STANDARD,
          },
        ]);
      }
    }

    setValues({ ...values, [field]: value });
  };

  useEffect(() => {
    async function call() {
      if (!values.rewardToken || !values.rewardStandard) {
        setTokenId(undefined);
        return;
      }
      const { valid } = await standardCheck(values.rewardToken, values.rewardStandard as TOKEN_STANDARD);
      if (!valid) {
        setTokenId(undefined);
      } else {
        setTokenId(values.rewardToken);
      }
    }

    call();
  }, [values.rewardToken, values.rewardStandard]);

  const [, rewardToken] = useToken(tokenId);
  const { result: poolMetadata } = useSwapPoolMetadata(values.pool);
  const [, poolToken0] = useToken(poolMetadata?.token0.address);
  const [, poolToken1] = useToken(poolMetadata?.token1.address);

  const handleCreateFarmsEvent = async (identity: ActorIdentity) => {
    if (!identity || loading || !principal || !rewardToken || !poolToken0 || !poolToken1) return;

    setLoading(true);

    const { status, message } = await createV3Farm({
      rewardToken: getSwapTokenArgs(rewardToken.address),
      startTime: BigInt(parseInt(String(values.startDateTime.getTime() / 1000), 10)),
      endTime: BigInt(parseInt(String(values.endDateTime.getTime() / 1000), 10)),
      pool: Principal.fromText(values.pool),
      secondPerCycle: BigInt(values.secondPerCycle),
      rewardAmount: BigInt(formatTokenAmount(values.reward, rewardToken.decimals).toString()),
      refunder: Principal.fromText(values.refunder),
      token0AmountLimit: BigInt(formatTokenAmount(values.token0AmountLimit, poolToken0.decimals).toString()),
      token1AmountLimit: BigInt(formatTokenAmount(values.token1AmountLimit, poolToken1.decimals).toString()),
      priceInsideLimit: values.priceInsideLimit === "true",
    });

    openTip(status === ResultStatus.OK ? "Created successfully" : message, status);

    setLoading(false);

    if (status === ResultStatus.OK) {
      history.push("/farm");
    }
  };

  let errorMsg = "";
  if (!values.rewardToken) errorMsg = t("stake.create.enter.reward.token");
  if (!values.rewardStandard) errorMsg = t("stake.create.enter.reward.standard");
  if (!rewardToken) errorMsg = t`Invalid reward token`;
  if (!values.pool) errorMsg = t`Enter the pool`;
  if (!values.refunder) errorMsg = t`Enter the refunder`;
  if (!values.reward) errorMsg = t("farm.create.enter.reward");
  if (!values.token0AmountLimit && values.token0AmountLimit !== 0)
    errorMsg = t`Enter the token0 minimum staking amount `;
  if (!values.token1AmountLimit && values.token1AmountLimit !== 0)
    errorMsg = t`Enter the token1 minimum staking amount`;

  return (
    <Wrapper>
      <MainCard>
        <Grid container justifyContent="center">
          <Box sx={{ maxWidth: "474px", width: "100%" }}>
            <Box mt="30px" sx={{ width: "100%" }} className={classes.mintInfoBox}>
              <FilledTextField
                placeholder={t("stake.enter.reward.id")}
                onChange={(value) => handleFieldChange(value, "rewardToken")}
                value={values.rewardToken}
              />

              <Select
                menus={TokenStandards}
                placeholder={t`Select the reward token standard`}
                onChange={(value) => handleFieldChange(value, "rewardStandard")}
                value={values.rewardStandard}
                filled
              />

              <FilledTextField
                placeholder={t`Enter swap pool id`}
                onChange={(value) => handleFieldChange(value, "pool")}
                value={values.pool}
              />
              <FilledTextField
                placeholder={t`Enter the refunder`}
                onChange={(value) => handleFieldChange(value, "refunder")}
                value={values.refunder}
              />
              <Box>
                <Typography color="text.secondary">{t("common.start.end.time")}</Typography>
                <Box mt={2}>
                  <Flex fullWidth justify="space-between">
                    <Box
                      sx={{
                        width: "48%",
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          value={dayjs(values.startDateTime)}
                          onChange={(newValue: any) => {
                            handleFieldChange(timeParser(newValue), "startDateTime");
                          }}
                          minDateTime={dayjs(new Date())}
                          maxDateTime={values.endDateTime ? dayjs(new Date(values.endDateTime)) : undefined}
                        />
                      </LocalizationProvider>
                    </Box>
                    <Box
                      sx={{
                        width: "48%",
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          value={dayjs(values.endDateTime)}
                          onChange={(newValue: any) => {
                            handleFieldChange(timeParser(newValue), "endDateTime");
                          }}
                          minDateTime={values.startDateTime ? dayjs(new Date(values.startDateTime)) : dayjs(new Date())}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Flex>
                </Box>
              </Box>

              <NumberFilledTextField
                placeholder={t("common.enter.token.claimed")}
                onChange={(value: number) => handleFieldChange(value, "reward")}
                value={values.reward}
                numericProps={{
                  thousandSeparator: true,
                  decimalScale: values?.rewardTokenDecimals ?? 8,
                  allowNegative: false,
                  maxLength: 100,
                }}
              />

              <NumberFilledTextField
                placeholder={t`Enter the token0 minimum staking amount`}
                onChange={(value: number) => handleFieldChange(value, "token0AmountLimit")}
                value={values.token0AmountLimit}
                numericProps={{
                  thousandSeparator: true,
                  decimalScale: values?.rewardTokenDecimals ?? 8,
                  allowNegative: false,
                  maxLength: 100,
                }}
              />

              <NumberFilledTextField
                placeholder={t`Enter the token1 minimum staking amount`}
                onChange={(value: number) => handleFieldChange(value, "token1AmountLimit")}
                value={values.token1AmountLimit}
                numericProps={{
                  thousandSeparator: true,
                  decimalScale: values?.rewardTokenDecimals ?? 8,
                  allowNegative: false,
                  maxLength: 100,
                }}
              />

              <NumberFilledTextField
                placeholder={t`Enter the secondPerCycle`}
                onChange={(value: number) => handleFieldChange(value, "secondPerCycle")}
                value={values.secondPerCycle}
                numericProps={{
                  thousandSeparator: true,
                  decimalScale: 0,
                  allowNegative: false,
                  maxLength: 100,
                }}
              />

              <Select
                filled
                menus={[
                  { label: "True", value: "true" },
                  { label: "False", value: "false" },
                ]}
                placeholder={t("stake.set.price.inside.limit")}
                onChange={(value) => handleFieldChange(value, "priceInsideLimit")}
                value={values.priceInsideLimit}
              />
            </Box>
            <Typography sx={{ margin: "10px 0 0 0" }}>FarmControllerId: {FarmControllerId}</Typography>
            <Box mt={4}>
              <Identity onSubmit={handleCreateFarmsEvent}>
                {({ submit }: CallbackProps) => (
                  <AuthButton
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={submit}
                    disabled={Boolean(errorMsg) || loading}
                    loading={loading}
                  >
                    {errorMsg || t`Create farm`}
                  </AuthButton>
                )}
              </Identity>
            </Box>
          </Box>
        </Grid>
      </MainCard>
    </Wrapper>
  );
}
