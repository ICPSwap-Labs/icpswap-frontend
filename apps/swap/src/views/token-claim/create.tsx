/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Grid, Box, Input } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MainCard from "components/cards/MainCard";
import { useAccountPrincipal } from "store/auth/hooks";
import FilledTextField from "components/FilledTextField";
import { MessageTypes, useTips } from "hooks/useTips";
import { TextFieldNumberComponent, Wrapper } from "components/index";
import { Trans, t } from "@lingui/macro";
import Identity, { CallbackProps } from "components/Identity";
import { Theme } from "@mui/material/styles";
import { formatTokenAmount, isValidAccount, numberToString, isValidPrincipal } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { ResultStatus, type ActorIdentity, type StatusResult } from "@icpswap/types";
import Button from "components/authentication/ButtonConnector";
import { createClaimEvent, setClaimEventData, setClaimEventReady, setClaimEventState } from "@icpswap/hooks";
import { TOKEN_STANDARD } from "@icpswap/types";
import { read, utils } from "xlsx";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { Principal } from "@dfinity/principal";
import { standardCheck } from "utils/token/standardCheck";
import { useUpdateTokenStandard } from "store/token/cache/hooks";
import Config from "./Config";

export const TokenStandards = [
  { label: "EXT", value: TOKEN_STANDARD.EXT },
  { label: "DIP20", value: TOKEN_STANDARD.DIP20 },
  { label: "ICRC1", value: TOKEN_STANDARD.ICRC1 },
  { label: "ICRC2", value: TOKEN_STANDARD.ICRC2 },
  { label: "DIP20_WICP", value: TOKEN_STANDARD.DIP20_WICP },
  { label: "DIP20_XTC", value: TOKEN_STANDARD.DIP20_XTC },
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
  name: string;
  id: string;
  standard: TOKEN_STANDARD;
  tokenAmount: number;
  storageId: string;
  userAmount: number;
};

type UserClaimItem = {
  address: string;
  amount: number;
};

type ExcelClaimItem = {
  address: string;
  amount: number;
  __rowNum__: number;
};

export default function CreateTokenClaim() {
  const classes = useStyles();
  const history = useHistory();
  const principal = useAccountPrincipal();
  const [values, setValues] = useState<Values>({ standard: TOKEN_STANDARD.EXT } as Values);
  const [openTip] = useTips();
  const [loading, setLoading] = useState(false);

  const [userClaims, setUserClaims] = useState<UserClaimItem[]>([]);

  const [inValidUserClaims, setInvalidUserClaims] = useState<ExcelClaimItem[]>([]);

  const updateTokenStandard = useUpdateTokenStandard();

  const [tokenId, setTokenId] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function call() {
      const { valid } = await standardCheck(values.id, values.standard as TOKEN_STANDARD);

      if (!valid) {
        openTip("Token standard is not correct", MessageTypes.error);
        return;
      }

      updateTokenStandard({ canisterId: values.id, standard: values.standard as TOKEN_STANDARD });

      setTokenId(values.id);
    }

    if (values.standard && values.id) {
      call();
    }
  }, [values.standard, values.id]);

  const { result: tokenInfo } = useTokenInfo(tokenId);

  const handleFieldChange = (value: string, field: string) => {
    setValues({ ...values, [field]: value });
  };

  const [importLoading, setImportLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    setImportLoading(true);

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (e: any) => {
      const data = e.target.result;

      const xlsx = read(data, {
        type: "binary",
      });

      const userClaims: UserClaimItem[] = [];
      const inValidUserClaims: ExcelClaimItem[] = [];

      for (let i = 0; i < xlsx.SheetNames.length; i++) {
        const sheetData = utils.sheet_to_json<ExcelClaimItem>(xlsx.Sheets[xlsx.SheetNames[i]]);

        for (let i = 0; i < sheetData.length; i++) {
          const { address } = sheetData[i];
          const { amount } = sheetData[i];

          if (!address || amount === undefined) {
            openTip(t`Incorrect file content`, MessageTypes.error);
            break;
          }

          if (
            (isValidAccount(address) || isValidPrincipal(address)) &&
            !new BigNumber(amount).isNaN() &&
            new BigNumber(amount).isGreaterThan(0)
          ) {
            userClaims.push(sheetData[i]);
          } else {
            inValidUserClaims.push(sheetData[i]);
          }
        }
      }

      setUserClaims(userClaims);
      setInvalidUserClaims(inValidUserClaims);

      setImportLoading(false);

      // reset input value
      event.target.value = "";
    };
  };

  const handleCreateClaimEvent = async (identity: ActorIdentity) => {
    if (!identity || loading || !tokenInfo || !principal) return;
    setLoading(true);

    const { status, message, data } = await createClaimEvent(
      {
        tokenName: tokenInfo.name,
        tokenSymbol: tokenInfo.symbol,
        tokenDecimals: tokenInfo.decimals,
        tokenCid: tokenInfo.canisterId,
        tokenStandard: values.standard,
        totalUserAmount: BigInt(values.userAmount),
        totalTokenAmount: BigInt(numberToString(formatTokenAmount(values.tokenAmount, tokenInfo.decimals))),
        claimedTokenAmount: BigInt(0),
        claimEventId: "1",
        claimEventName: values.name,
        claimEventStatus: BigInt(0),
        claimEventCreator: principal,
        claimCanisterId: "",
        claimedUserAmount: BigInt(0),
      },
      identity,
    );

    openTip(status === ResultStatus.OK ? "Created successfully" : message, status);

    if (data) {
      const _userClaims = userClaims.map((ele) => ({
        user: isValidPrincipal(ele.address) ? { principal: Principal.fromText(ele.address) } : { address: ele.address },
        quota: BigInt(
          numberToString(
            formatTokenAmount(
              new BigNumber(ele.amount).toFixed(tokenInfo.decimals, BigNumber.ROUND_DOWN),
              tokenInfo.decimals,
            ),
          ),
        ),
      }));

      const promises: Promise<StatusResult<boolean>>[] = [];

      for (let i = 0; i < _userClaims.length; i += 20000) {
        const userClaims = _userClaims.slice(i, i + 20000);
        promises.push(setClaimEventData(data, userClaims, identity));
      }

      await Promise.all(promises)
        .then((result) => {
          result.forEach((res) => {
            openTip(res.status === ResultStatus.OK ? "Set event user data successfully" : res.message, res.status);
          });
        })
        .catch((err) => {
          console.error(err);
        });

      const { status: status2, message: message2 } = await setClaimEventReady(data, identity);
      openTip(status2 === ResultStatus.OK ? "Set event ready successfully" : message2, status2);
      const { status: status3, message: message3 } = await setClaimEventState(data, true, identity);
      openTip(status3 === ResultStatus.OK ? "Set event state successfully" : message3, status3);
    }

    if (status === ResultStatus.OK) {
      history.push("/token-claim");
    }

    setLoading(false);
  };

  const ExcelTotalAmount = tokenInfo
    ? userClaims.reduce((prev, curr) => {
        return prev.plus(new BigNumber(curr.amount).toFixed(tokenInfo.decimals, BigNumber.ROUND_DOWN));
      }, new BigNumber(0))
    : new BigNumber(0);

  let errorMsg = "";
  if (!values.userAmount) errorMsg = t`Enter the claimed token amount`;
  if (!values.tokenAmount) errorMsg = t`Enter user amount`;
  if (!values.standard) errorMsg = t`Select the token standard`;
  if (!values.id) errorMsg = t`Enter the token canister id`;
  if (!values.name) errorMsg = t`Enter the claim event name`;

  return (
    <Wrapper>
      <MainCard>
        <Grid container justifyContent="center">
          <Box sx={{ maxWidth: "474px", width: "100%" }}>
            <Grid mt="30px" container className={classes.mintInfoBox}>
              <FilledTextField
                placeholder={t`Enter claim event name`}
                onChange={(value) => handleFieldChange(value, "name")}
                value={values.name}
              />

              <FilledTextField
                placeholder="Enter the token canister id"
                value={values.id}
                onChange={(value) => handleFieldChange(value, "id")}
              />

              <FilledTextField
                select
                menus={TokenStandards}
                placeholder={t`Select the token standard`}
                onChange={(value) => handleFieldChange(value, "standard")}
                value={values.standard}
              />

              <FilledTextField
                placeholder={t`Enter total token claimed amount`}
                onChange={(value) => handleFieldChange(value, "tokenAmount")}
                value={values.tokenAmount}
                InputProps={{
                  disableUnderline: true,
                  inputComponent: TextFieldNumberComponent,
                  inputProps: {
                    thousandSeparator: true,
                    decimalScale: tokenInfo?.decimals ?? 8,
                    allowNegative: false,
                    maxLength: 100,
                    value: values.tokenAmount,
                  },
                }}
              />

              <FilledTextField
                placeholder={t`Enter total user amount`}
                onChange={(value) => handleFieldChange(value, "userAmount")}
                value={values.userAmount}
                InputProps={{
                  disableUnderline: true,
                  inputComponent: TextFieldNumberComponent,
                  inputProps: {
                    thousandSeparator: true,
                    decimalScale: 0,
                    allowNegative: false,
                    maxLength: 100,
                    value: values.userAmount,
                  },
                }}
              />

              <Box sx={{ position: "relative" }}>
                <Input
                  type="file"
                  inputProps={{
                    accept: ".xlsx, .xls",
                  }}
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "42px",
                    top: 0,
                    left: 0,
                    opacity: 0,
                    zIndex: 2,
                    cursor: "pointer",
                    "& input": {
                      width: "100%",
                      height: "100%",
                      padding: "0",
                      cursor: "pointer",
                    },
                    "&::before": {
                      display: "none",
                    },
                  }}
                  onChange={handleFileChange}
                />
                <Button variant="outlined" fullWidth size="large" loading={importLoading}>
                  <Trans>Import Data</Trans>
                </Button>
                {!!userClaims.length || !!inValidUserClaims.length ? (
                  <Box mt="4px">
                    <Typography component="span" fontSize="12px">
                      {userClaims.length} valid accounts (TotalAmount: {ExcelTotalAmount.toFormat()})
                    </Typography>

                    {inValidUserClaims?.length ? (
                      <Typography
                        component="span"
                        fontSize="12px"
                        sx={{
                          marginLeft: "5px",
                        }}
                      >
                        {inValidUserClaims.length} invalid accounts(Row{" "}
                        {inValidUserClaims.map((ele, index) => `${index !== 0 ? ", " : ""}${ele.__rowNum__ + 1}`)})
                      </Typography>
                    ) : null}
                  </Box>
                ) : null}
              </Box>
            </Grid>
            <Box mt={4}>
              <Identity onSubmit={handleCreateClaimEvent}>
                {({ submit }: CallbackProps) => (
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={submit}
                    disabled={Boolean(errorMsg) || loading}
                    loading={loading}
                  >
                    {errorMsg || t`Create claim event`}
                  </Button>
                )}
              </Identity>
            </Box>
          </Box>
        </Grid>

        <Config />
      </MainCard>
    </Wrapper>
  );
}
