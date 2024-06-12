// @ts-nocheck
import { useEffect, useState } from "react";
import { Typography, Grid, Box } from "@mui/material";
import { MainCard, Wrapper, TextFieldNumberComponent, FilledTextField } from "components/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { MessageTypes, useTips } from "hooks/useTips";
import { t } from "@lingui/macro";
import Identity, { CallbackProps } from "components/Identity";
import { numberToString } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import Button from "components/authentication/ButtonConnector";
import { createStakingTokenPool } from "@icpswap/hooks";
import { type ActorIdentity, ResultStatus } from "@icpswap/types";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";
import { standardCheck } from "utils/token/standardCheck";
import { getTokenInfo } from "hooks/token/calls";
import { timeParser } from "utils/index";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useUpdateTokenStandard } from "store/token/cache/hooks";
import { TokenInfo } from "types/token";

export const TokenStandards = [
  { label: "EXT", value: TOKEN_STANDARD.EXT },
  { label: "DIP20", value: TOKEN_STANDARD.DIP20 },
  { label: "DIP20-WICP", value: TOKEN_STANDARD.DIP20_WICP },
  { label: "DIP20-XTC", value: TOKEN_STANDARD.DIP20_XTC },
  { label: "ICRC-1", value: TOKEN_STANDARD.ICRC1 },
  { label: "ICRC-2", value: TOKEN_STANDARD.ICRC2 },
  { label: "ICP", value: TOKEN_STANDARD.ICP },
];

type Values = {
  name: string;
  rewardStandard: string;
  rewardToken: string;
  rewardTokenDecimals: number;
  rewardTokenSymbol: string;
  rewardTokenFee: number | bigint;
  startDateTime: number;
  endDateTime: number;
  rewardPerTime: number;
  stakingToken: string;
  stakingTokenDecimals: number;
  stakingTokenSymbol: string;
  stakingStandard: string;
  stakingTokenFee: number | bigint;
  outputPerSecond: number;
  BONUS_MULTIPLIER: number;
};

export default function CreateStakingTokenPool() {
  const principal = useAccountPrincipal();
  const updateTokenStandard = useUpdateTokenStandard();

  const [values, setValues] = useState<Values>({
    BONUS_MULTIPLIER: 1,
  } as Values);

  const [openTip] = useTips();

  const [loading, setLoading] = useState(false);

  const [rewardTokenInfo, setRewardTokenInfo] = useState<TokenInfo | undefined>(undefined);

  const handleFieldChange = (value: string | number, field: string) => {
    setValues({ ...values, [field]: value });
  };

  useEffect(() => {
    const call = async () => {
      if (values.rewardToken && values.rewardStandard) {
        const { valid: rewardTokenValid } = await standardCheck(
          values.rewardToken,
          values.rewardStandard as TOKEN_STANDARD,
        );

        if (!rewardTokenValid) {
          openTip("reward token standard is incorrect", MessageTypes.error);
          setLoading(false);
          return;
        }

        updateTokenStandard({
          canisterId: values.rewardToken,
          standard: values.rewardStandard as TOKEN_STANDARD,
        });

        const rewardTokenInfo = await getTokenInfo(values.rewardToken);

        setRewardTokenInfo(rewardTokenInfo);
      }
    };

    call();
  }, [values.rewardToken, values.rewardStandard]);

  const handleCreateEvent = async (identity: ActorIdentity) => {
    if (!identity || loading || !principal) return;
    setLoading(true);

    const { valid: rewardTokenValid } = await standardCheck(
      values.rewardToken,
      values.rewardStandard as TOKEN_STANDARD,
    );

    if (!rewardTokenValid) {
      openTip("reward token standard is incorrect", MessageTypes.error);
      setLoading(false);
      return;
    }

    updateTokenStandard({
      canisterId: values.rewardToken,
      standard: values.rewardStandard as TOKEN_STANDARD,
    });

    const rewardTokenInfo = await getTokenInfo(values.rewardToken);

    if (!rewardTokenInfo) {
      openTip("can't got reward token info, please try again", MessageTypes.error);
      setLoading(false);
      return;
    }

    const { valid: stakingTokenValid } = await standardCheck(
      values.stakingToken,
      values.stakingStandard as TOKEN_STANDARD,
    );

    if (!stakingTokenValid) {
      openTip("staking token standard is incorrect", MessageTypes.error);
      setLoading(false);
      return;
    }

    updateTokenStandard({
      canisterId: values.stakingToken,
      standard: values.stakingStandard as TOKEN_STANDARD,
    });

    const stakingTokenInfo = await getTokenInfo(values.stakingToken);

    if (!stakingTokenInfo) {
      openTip("can't got staking token info, please try again", MessageTypes.error);
      setLoading(false);
      return;
    }

    const amount = new BigNumber(values.outputPerSecond)
      .multipliedBy(10 ** rewardTokenInfo.decimals)
      .dividedBy(values.BONUS_MULTIPLIER);

    if (amount.isLessThan(1) || amount.toString().includes(".")) {
      openTip("Wrong amount per second", MessageTypes.error);
      setLoading(false);
      return;
    }

    const { status, message } = await createStakingTokenPool(
      {
        name: values.name,

        stakingTokenSymbol: stakingTokenInfo.symbol,
        stakingToken: { address: stakingTokenInfo.canisterId, standard: values.stakingStandard },
        stakingTokenFee: stakingTokenInfo.transFee,
        stakingTokenDecimals: BigInt(stakingTokenInfo.decimals),

        rewardTokenSymbol: rewardTokenInfo.symbol,
        rewardToken: { address: rewardTokenInfo.canisterId, standard: values.rewardStandard },
        rewardTokenFee: rewardTokenInfo.transFee,
        rewardTokenDecimals: BigInt(rewardTokenInfo.decimals),

        startTime: BigInt(values.startDateTime) / BigInt(1000),
        rewardPerTime: BigInt(
          numberToString(
            new BigNumber(values.outputPerSecond)
              .multipliedBy(10 ** rewardTokenInfo.decimals)
              .dividedBy(values.BONUS_MULTIPLIER),
          ),
        ),

        bonusEndTime: BigInt(values.endDateTime) / BigInt(1000),
        BONUS_MULTIPLIER: BigInt(values.BONUS_MULTIPLIER),
      },
      identity,
    );

    if (status === ResultStatus.OK) {
      openTip(`create success pool:${message}`, MessageTypes.success);
      setValues({
        BONUS_MULTIPLIER: 1000,
      } as Values);
    } else {
      openTip(message ?? "Failed to create token pool", MessageTypes.error);
    }

    setLoading(false);
  };

  let errorMsg = "";
  if (!values.name) errorMsg = t`Enter the name`;
  if (!values.rewardStandard) errorMsg = t`Enter the reward token standard`;
  if (!values.rewardToken) errorMsg = t`Enter the reward token`;
  if (!values.startDateTime) errorMsg = t`Enter the start time`;
  if (!values.endDateTime) errorMsg = t`Enter the bonus end time`;
  if (!values.outputPerSecond) errorMsg = t`Enter the output per second`;
  if (!values.stakingToken) errorMsg = t`Enter the staking Token`;
  if (!values.stakingStandard) errorMsg = t`Enter the staking token standard`;
  if (!values.BONUS_MULTIPLIER) errorMsg = t`Enter the bonus multiplier`;

  return (
    <Wrapper>
      <MainCard>
        <Grid container justifyContent="center">
          <Box sx={{ maxWidth: "474px", width: "100%", display: "grid", gap: "20px 0" }}>
            <Box>
              <FilledTextField
                label={t`Token pool's name`}
                placeholder={t`Enter token pool's name`}
                onChange={(value) => handleFieldChange(value, "name")}
                value={values.name}
              />
            </Box>

            <Box>
              <FilledTextField
                label={t`Reward token id`}
                placeholder={t`Enter reward token id`}
                onChange={(value) => handleFieldChange(value, "rewardToken")}
                value={values.rewardToken}
              />
            </Box>

            <Box>
              <FilledTextField
                select
                label={t`Reward token standard`}
                menus={TokenStandards}
                placeholder={t`Select reward token standard`}
                onChange={(value) => handleFieldChange(value, "rewardStandard")}
                value={values.rewardStandard}
              />
            </Box>

            <Box>
              <FilledTextField
                label={t`Staking token id`}
                placeholder={t`Enter staking token id`}
                onChange={(value) => handleFieldChange(value, "stakingToken")}
                value={values.stakingToken}
              />
            </Box>

            <Box>
              <FilledTextField
                label={t`Staking token standard`}
                select
                menus={TokenStandards}
                placeholder={t`Select staking token standard`}
                onChange={(value) => handleFieldChange(value, "stakingStandard")}
                value={values.stakingStandard}
              />
            </Box>

            <Box>
              <Typography color="text.primary">Start/End Time</Typography>
              <Box mt="12px">
                <Grid container justifyContent="space-between">
                  <Grid
                    item
                    sx={{
                      width: "48%",
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        renderInput={(params: any) => (
                          <FilledTextField
                            fullWidth
                            {...params}
                            InputProps={{
                              ...(params?.InputProps ?? {}),
                              disableUnderline: true,
                            }}
                            helperText=""
                          />
                        )}
                        value={values.startDateTime ? dayjs(values.startDateTime) : null}
                        onChange={(newValue: any) => {
                          handleFieldChange(
                            timeParser(new Date(newValue.toDate()).getTime()).getTime(),
                            "startDateTime",
                          );
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
                        renderInput={(params: any) => (
                          <FilledTextField
                            fullWidth
                            {...params}
                            InputProps={{
                              ...(params?.InputProps ?? {}),
                              disableUnderline: true,
                            }}
                            helperText=""
                          />
                        )}
                        value={values.endDateTime ? dayjs(values.endDateTime) : null}
                        onChange={(newValue: any) => {
                          handleFieldChange(timeParser(new Date(newValue.toDate()).getTime()).getTime(), "endDateTime");
                        }}
                        minDateTime={values.startDateTime ? dayjs(values.startDateTime) : dayjs(new Date())}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <Box>
              <FilledTextField
                label={t`Output Per Second`}
                placeholder={t`Enter output per second`}
                onChange={(value) => handleFieldChange(value, "outputPerSecond")}
                value={values.outputPerSecond}
                InputProps={{
                  disableUnderline: true,
                  inputComponent: TextFieldNumberComponent,
                  inputProps: {
                    thousandSeparator: true,
                    decimalScale: rewardTokenInfo?.decimals ?? 8,
                    allowNegative: false,
                    maxLength: 100,
                    value: values.outputPerSecond,
                  },
                }}
              />
            </Box>

            <Box>
              <FilledTextField
                label={t`Bonus multiplier`}
                placeholder={t`Enter bonus multiplier`}
                onChange={(value) => handleFieldChange(value, "BONUS_MULTIPLIER")}
                value={values.BONUS_MULTIPLIER}
              />
            </Box>

            <Box mt={4}>
              <Identity
                onSubmit={async (identity) => {
                  await handleCreateEvent(identity);
                }}
              >
                {({ submit }: CallbackProps) => (
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={submit}
                    disabled={Boolean(errorMsg) || loading}
                    loading={loading}
                  >
                    {errorMsg || t`Create token pool`}
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
