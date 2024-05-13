import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Typography, TextFieldProps, Grid, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAccountPrincipal } from "store/auth/hooks";
import { FilledTextField, Wrapper, MainCard, NumberFilledTextField } from "components/index";
import { useTips } from "hooks/useTips";
import { t } from "@lingui/macro";
import Identity, { CallbackProps } from "components/Identity";
import { Theme } from "@mui/material/styles";
import { formatTokenAmount } from "@icpswap/utils";
import Button from "components/authentication/ButtonConnector";
import { createV3Farm, useSwapPoolMetadata } from "@icpswap/hooks";
import { TOKEN_STANDARD } from "@icpswap/types";
import { type ActorIdentity, ResultStatus } from "@icpswap/types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { timeParser } from "utils/index";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { useUpdateTokenStandard } from "store/token/cache/hooks";
import { getSwapTokenArgs } from "hooks/token/index";
import dayjs from "dayjs";
import { FarmControllerId } from "constants/canister";
import { standardCheck } from "utils/token/standardCheck";
import { Principal } from "@dfinity/principal";

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
  rewardPool: string;
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
        updateTokenStandard({
          canisterId: values.rewardToken,
          standard: values.rewardStandard as TOKEN_STANDARD,
        });
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

  const { result: rewardTokenInfo } = useTokenInfo(tokenId);
  const { result: poolMetadata } = useSwapPoolMetadata(values.pool);
  const { result: poolToken0 } = useTokenInfo(poolMetadata?.token0.address);
  const { result: poolToken1 } = useTokenInfo(poolMetadata?.token1.address);

  const handleCreateFarmsEvent = async (identity: ActorIdentity) => {
    if (!identity || loading || !principal || !rewardTokenInfo || !poolToken0 || !poolToken1) return;

    setLoading(true);

    const { status, message } = await createV3Farm({
      rewardToken: getSwapTokenArgs(rewardTokenInfo.canisterId),
      startTime: BigInt(parseInt(String(values.startDateTime.getTime() / 1000), 10)),
      endTime: BigInt(parseInt(String(values.endDateTime.getTime() / 1000), 10)),
      pool: Principal.fromText(values.pool),
      secondPerCycle: BigInt(values.secondPerCycle),
      rewardAmount: BigInt(formatTokenAmount(values.reward, rewardTokenInfo.decimals).toString()),
      rewardPool: Principal.fromText(values.rewardPool),
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
  if (!values.rewardToken) errorMsg = t`Enter the reward token`;
  if (!values.rewardStandard) errorMsg = t`Enter the reward standard`;
  if (!rewardTokenInfo) errorMsg = t`Invalid reward token`;
  if (!values.rewardPool) errorMsg = t`Enter reward token swap pool id`;
  if (!values.pool) errorMsg = t`Enter the pool`;
  if (!values.refunder) errorMsg = t`Enter the refunder`;
  if (!values.reward) errorMsg = t`Enter the reward`;
  if (!values.token0AmountLimit && values.token0AmountLimit !== 0)
    errorMsg = t`Enter the token0 minimum staking amount `;
  if (!values.token1AmountLimit && values.token1AmountLimit !== 0)
    errorMsg = t`Enter the token1 minimum staking amount`;

  return (
    <Wrapper>
      <MainCard>
        <Grid container justifyContent="center">
          <Box sx={{ maxWidth: "474px", width: "100%" }}>
            <Grid mt="30px" container className={classes.mintInfoBox}>
              <FilledTextField
                label="Reward Token"
                placeholder={t`Enter reward token id`}
                onChange={(value) => handleFieldChange(value, "rewardToken")}
                value={values.rewardToken}
              />
              <FilledTextField
                select
                menus={TokenStandards}
                label="Reward standard"
                placeholder={t`Select the reward token standard`}
                onChange={(value) => handleFieldChange(value, "rewardStandard")}
                value={values.rewardStandard}
              />
              <FilledTextField
                label="Reward token swap pool id "
                placeholder={t`Enter reward token swap pool id`}
                onChange={(value) => handleFieldChange(value, "rewardPool")}
                value={values.rewardPool}
              />
              <FilledTextField
                label="Pool id"
                placeholder={t`Enter swap pool id`}
                onChange={(value) => handleFieldChange(value, "pool")}
                value={values.pool}
              />
              <FilledTextField
                label={t`Refunder`}
                placeholder={t`Enter the refunder`}
                onChange={(value) => handleFieldChange(value, "refunder")}
                value={values.refunder}
              />
              <Box>
                <Typography color="text.secondary">Start/End Time</Typography>
                <Box mt={2}>
                  <Grid container justifyContent="space-between">
                    <Grid
                      item
                      sx={{
                        width: "48%",
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          // @ts-ignore
                          renderInput={(params: TextFieldProps) => (
                            <FilledTextField
                              fullWidth
                              {...params}
                              InputProps={{
                                ...(params?.InputProps ?? {}),
                              }}
                              helperText=""
                            />
                          )}
                          value={values.startDateTime}
                          onChange={(newValue: any) => {
                            handleFieldChange(timeParser(newValue), "startDateTime");
                          }}
                          minDateTime={dayjs(new Date())}
                          maxDateTime={values.endDateTime ? dayjs(new Date(values.endDateTime)) : undefined}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid
                      item
                      sx={{
                        width: "48%",
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          // @ts-ignore
                          renderInput={(params: TextFieldProps) => (
                            <FilledTextField
                              fullWidth
                              {...params}
                              InputProps={{
                                ...(params?.InputProps ?? {}),
                              }}
                              helperText=""
                            />
                          )}
                          value={values.endDateTime}
                          onChange={(newValue: any) => {
                            handleFieldChange(timeParser(newValue), "endDateTime");
                          }}
                          minDateTime={values.startDateTime ? dayjs(new Date(values.startDateTime)) : dayjs(new Date())}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              <NumberFilledTextField
                label="Reward"
                placeholder={t`Enter total token claimed amount`}
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
                label={`Token0 minimum staking amount ${poolToken0?.symbol ? `(${poolToken0?.symbol})` : ""}`}
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
                label={`Token1 minimum staking amount ${poolToken1?.symbol ? `(${poolToken1?.symbol})` : ""}`}
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
                label="SecondPerCycle"
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

              <FilledTextField
                select
                label="PriceInsideLimit"
                placeholder={t`Select the PriceInsideLimit`}
                onChange={(value) => handleFieldChange(value, "priceInsideLimit")}
                value={values.priceInsideLimit}
                menus={[
                  { label: "True", value: "true" },
                  { label: "False", value: "false" },
                ]}
              />
            </Grid>
            <Typography sx={{ margin: "10px 0 0 0" }}>FarmControllerId: {FarmControllerId}</Typography>
            <Box mt={4}>
              <Identity onSubmit={handleCreateFarmsEvent}>
                {({ submit }: CallbackProps) => (
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={submit}
                    disabled={Boolean(errorMsg) || loading}
                    loading={loading}
                  >
                    {errorMsg || t`Create farm`}
                  </Button>
                )}
              </Identity>
            </Box>
          </Box>
        </Grid>
      </MainCard>
    </Wrapper>
  );
}
