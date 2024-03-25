/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Input,
  useMediaQuery,
} from "@mui/material";
import { useParams, useHistory } from "react-router-dom";
import { isValidAccount, isValidPrincipal, writeFileOneSheet, millisecond2Nanosecond } from "@icpswap/utils";
import { Wrapper, MainCard, Breadcrumbs, TextButton, FilledTextField, NumberFilledTextField } from "components/index";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { type StatusResult, type ActorIdentity } from "@icpswap/types";
import { Trans, t } from "@lingui/macro";
import { timeParser } from "utils/index";
import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useSuccessTip, useErrorTip } from "hooks/useTips";
import Markdown from "components/markdown";
import { utils, read } from "xlsx";
import { useAccountPrincipal, useAccount } from "store/auth/hooks";
import { createVotingProposal, setVotingProposalPowers } from "@icpswap/hooks";
import { VotingFileCanisterId } from "constants/canister";
import { Principal } from "@dfinity/principal";
import Preview from "components/vote/Preview";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

export type ExcelPower = {
  "Address(Account ID or Principal ID)": string;
  "Voting Power": number | string;
  __rowNum__: number;
};

export type Power = {
  address: string;
  power: number | string;
  __rowNum__: number;
};

export type Values = {
  title: string;
  content: string;
  startDateTime: Date | undefined;
  endDateTime: Date | undefined;
  options: string[];
  powers: Power[];
  invalidPowers: Power[];
  userAmount: string | number;
};

export default function VotingCreateProposal() {
  const { id: canisterId } = useParams<{ id: string }>();
  const history = useHistory();

  const account = useAccount();
  const principal = useAccountPrincipal();
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();

  const [importLoading, setImportLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const defaultValues = {
    options: [""],
    title: "",
    content: "",
    startDateTime: new Date(new Date().getTime() + 10 * 60 * 1000),
    endDateTime: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
    powers: [],
    invalidPowers: [],
    userAmount: "",
  } as Values;

  const [values, setValues] = useState<Values>(defaultValues);

  const onFiledChange = (value: any, field: string) => {
    setValues((prevState) => {
      return {
        ...prevState,
        [field]: value,
      };
    });
  };

  const handleOptionsAdd = () => {
    setValues({
      ...values,
      options: [...values.options, ""],
    });
  };

  const onOptionChange = (value: any, index: number) => {
    const newOptions = [...values.options];

    newOptions.splice(index, 1, value);

    setValues({
      ...values,
      options: newOptions,
    });
  };

  const handleOptionDelete = (index: number) => {
    const newOptions = [...values.options];

    newOptions.splice(index, 1);

    setValues({
      ...values,
      options: newOptions,
    });
  };

  const handleCreateVote = async (identity: ActorIdentity, { loading }: SubmitLoadingProps) => {
    if (loading || !principal || !account || !values.startDateTime || !values.endDateTime) return;

    const { status, message, data } = await createVotingProposal(identity, canisterId, {
      title: values.title,
      beginTime: BigInt(millisecond2Nanosecond(values.startDateTime.getTime())),
      endTime: BigInt(millisecond2Nanosecond(values.endDateTime.getTime())),
      createUser: account,
      content: values.content,
      options: values.options.map((option) => ({ k: option, v: BigInt(0) })),
      userAmount: BigInt(values.userAmount),
    });

    if (status === "ok" && data) {
      const powers = values.powers.map((item) => ({
        availablePowers: BigInt(item.power),
        address: isValidPrincipal(item.address)
          ? { principal: Principal.fromText(item.address) }
          : { address: item.address },
        usedPowers: BigInt(0),
      }));

      const promises: Promise<StatusResult<boolean>>[] = [];

      for (let i = 0; i < powers.length; i += 20000) {
        const _powers = powers.slice(i, i + 20000);
        promises.push(setVotingProposalPowers(identity, canisterId, data, _powers));
      }

      await Promise.all(promises).catch((err) => {
        console.error(err);
      });

      openSuccessTip(t`Created successfully`);

      setValues(defaultValues);

      history.push(`/voting/${canisterId}`);
    } else {
      openErrorTip(message);
    }
  };

  const handleImportPowers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportLoading(true);

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = async (e: any) => {
      const data = e.target.result;

      const xlsx = read(data, {
        type: "binary",
      });

      const validPowers: Power[] = [];
      const invalidPowers: Power[] = [];

      const isValidPower = (power: string | number): boolean => {
        const num = Number(power);
        return !isNaN(num);
      };

      for (let i = 0; i < xlsx.SheetNames.length; i++) {
        const sheetData = utils.sheet_to_json<ExcelPower>(xlsx.Sheets[xlsx.SheetNames[i]]);

        sheetData.forEach((row) => {
          const address = row["Address(Account ID or Principal ID)"];
          const power = row["Voting Power"];

          if ((isValidAccount(address) || isValidPrincipal(address)) && isValidPower(power)) {
            validPowers.push({
              address,
              power,
              __rowNum__: row.__rowNum__,
            });
          } else {
            invalidPowers.push({
              address,
              power,
              __rowNum__: row.__rowNum__,
            });
          }
        });
      }

      onFiledChange(validPowers, "powers");
      onFiledChange(invalidPowers, "invalidPowers");

      setImportLoading(false);

      // reset input value
      // @ts-ignore
      event.target.value = null;
    };
  };

  const hasEmptyOption = values.options.filter((option) => !option).length > 0;

  let errorMessage = "";
  if (!values.title) errorMessage = t`Enter the title`;
  if (!values.content) errorMessage = t`Enter the content`;
  if (!values.startDateTime || !values.endDateTime) errorMessage = t`Invalid date range`;
  if (!values.userAmount) errorMessage = t`Enter the amount of voters`;
  if (!values.options || values.options.length < 2 || hasEmptyOption) errorMessage = t`Invalid options`;
  if (!values.powers || values.powers.length < 1) errorMessage = t`Import the powers`;

  const down640 = useMediaQuery("(max-width:640px)");

  const handleDownloadTemplate = () => {
    const json = [
      {
        "Address(Account ID or Principal ID)": "b87d05b7cabe506e98015a9ece0c385ba977aaac64bc32952d9b9cfb109c83fe",
        "Voting Power": 300,
      },
      {
        "Address(Account ID or Principal ID)": "7qzdv-withz-33duz-mufka-bihhf-3hjtq-fh4l6-5imvq-xlpi3-ai5da-tae",
        "Voting Power": 1000,
      },
      {
        "Address(Account ID or Principal ID)": "49486a5eaa058147cfc5de34932562f0f3ce59bcf43a5de7b48dc65e72216dc5",
        "Voting Power": 564,
      },
      {
        "Address(Account ID or Principal ID)": "...",
        "Voting Power": "...",
      },
      {
        "Address(Account ID or Principal ID)": "...",
        "Voting Power": "...",
      },
    ];

    writeFileOneSheet(json, "Format of the list of voting power");
  };

  return (
    <Wrapper>
      <Breadcrumbs prevLabel={t`Project`} currentLabel={t`Create proposal`} prevLink={`/voting/${canisterId}`} />

      <Box mt="20px" />

      <MainCard contentSX={{ position: "relative" }}>
        <Grid container justifyContent="center">
          <Box sx={{ width: "100%", maxWidth: "570px" }}>
            <Box mt="20px">
              <Grid container justifyContent="flex-end">
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: "68px",
                    height: "28px",
                    border: "1px solid #4F5A84",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => setPreview(true)}
                >
                  <Typography fontSize="12px">
                    <Trans>Preview</Trans>
                  </Typography>
                </Grid>
              </Grid>

              <Box>
                <Typography color="text.primary">
                  <Trans>Title</Trans>
                </Typography>
                <Box mt="20px">
                  <FilledTextField onChange={(value) => onFiledChange(value, "title")} />
                </Box>
              </Box>

              <Box mt="20px">
                <Markdown
                  fileCanisterId={VotingFileCanisterId}
                  projectId={canisterId}
                  onChange={(value) => onFiledChange(value, "content")}
                />
              </Box>

              <Box mt="20px">
                <Typography color="text.primary">
                  <Trans>Start/End Time</Trans>
                </Typography>
                <Box mt={2}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: down640 ? "1fr" : "1fr 1fr",
                      gap: down640 ? "20px 0" : "0 20px",
                    }}
                  >
                    <Box>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          // @ts-ignore
                          renderInput={(params: any) => (
                            <TextField
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
                            onFiledChange(timeParser(newValue), "startDateTime");
                          }}
                          minDateTime={dayjs(new Date())}
                          maxDateTime={values.endDateTime ? dayjs(new Date(values.endDateTime)) : undefined}
                        />
                      </LocalizationProvider>
                    </Box>
                    <Box>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          // @ts-ignore
                          renderInput={(params: any) => (
                            <TextField
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
                            onFiledChange(timeParser(newValue), "endDateTime");
                          }}
                          minDateTime={values.startDateTime ? dayjs(new Date(values.startDateTime)) : dayjs(new Date())}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box mt="20px">
                <Typography color="text.primary">
                  <Trans>Amount of voters</Trans>
                </Typography>

                <Box mt={2}>
                  <NumberFilledTextField
                    value={values.userAmount}
                    onChange={(value: number) => onFiledChange(value, "userAmount")}
                    numericProps={{
                      allowNegative: false,
                      decimalScale: 0,
                      maxLength: 16,
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box mt="20px">
              <Grid container>
                <Grid item xs>
                  <Typography color="text.primary">
                    <Trans>Set up the Choices</Trans>
                  </Typography>
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: "72px",
                    height: "31px",
                    border: "1px solid #4F5A84",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={handleOptionsAdd}
                >
                  <AddIcon fontSize="small" />
                  <Typography color="text.primary">
                    <Trans>Add</Trans>
                  </Typography>
                </Grid>
              </Grid>

              <Box mt={2}>
                {values.options.map((option, index) => (
                  <Box key={index} sx={{ marginBottom: "10px", "&:last-child": { marginBottom: "0px" } }}>
                    <FilledTextField
                      value={option}
                      onChange={(value: any) => onOptionChange(value, index)}
                      InputProps={{
                        disableUnderline: true,
                        inputProps: {
                          maxLength: 100,
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <HighlightOffIcon
                              sx={{
                                color: "#8492C4",
                                fontSize: "20px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleOptionDelete(index)}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Box mt="20px">
                <Box>
                  <label htmlFor="contained-button-file">
                    <Input
                      id="contained-button-file"
                      type="file"
                      inputProps={{
                        accept: ".xlsx, .xls",
                      }}
                      sx={{
                        display: "none",
                      }}
                      onChange={handleImportPowers}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      size="large"
                      startIcon={importLoading ? <CircularProgress size={24} color="inherit" /> : null}
                    >
                      <Trans>Import list of voting power</Trans>
                    </Button>
                  </label>
                  <Grid container justifyContent="flex-end" mt="4px">
                    <TextButton onClick={handleDownloadTemplate}>
                      <Trans>Download the template</Trans>
                    </TextButton>
                  </Grid>
                </Box>
                {!!values.powers?.length || !!values.invalidPowers?.length ? (
                  <Box
                    mt={1}
                    sx={{
                      textAlign: "right",
                      maxHeight: "120px",
                      overflow: "hidden auto",
                    }}
                  >
                    <Typography fontSize="12px">
                      <Trans>{values.powers.length} valid voters</Trans>
                    </Typography>
                    {values.invalidPowers?.length ? (
                      <Typography fontSize="12px">
                        <Trans>{values.invalidPowers.length} invalid voters</Trans> (
                        {values.invalidPowers.reduce((prev, curr) => {
                          return `${prev ? `${prev}, ` : ""}row ${curr.__rowNum__ + 1}`;
                        }, "")}
                        )
                      </Typography>
                    ) : null}
                  </Box>
                ) : null}
              </Box>

              <Box mt="20px">
                <Identity onSubmit={handleCreateVote}>
                  {({ submit, loading }: CallbackProps) => (
                    <Button
                      onClick={submit}
                      disabled={loading || !!errorMessage}
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                    >
                      {errorMessage || t`Create proposal`}
                    </Button>
                  )}
                </Identity>
              </Box>
            </Box>
          </Box>
        </Grid>

        {preview ? (
          <Box sx={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}>
            <MainCard sx={{ width: "100%", height: "100%" }} contentSX={{ width: "100%", height: "100%" }}>
              <Grid container justifyContent="center" sx={{ height: "100%", overflow: "auto" }}>
                <Box sx={{ width: "100%", maxWidth: "570px" }}>
                  <Grid container justifyContent="flex-end">
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        width: "68px",
                        height: "28px",
                        border: "1px solid #4F5A84",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => setPreview(false)}
                    >
                      <Typography fontSize="12px">
                        <Trans>Back</Trans>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Preview title={values.title} content={values.content} />
                </Box>
              </Grid>
            </MainCard>
          </Box>
        ) : null}
      </MainCard>
    </Wrapper>
  );
}
