import React, { useState } from "react";
import { Typography, Box, Input } from "@mui/material";
import FilledTextField from "components/FilledTextField";
import { MessageTypes, useTips } from "hooks/useTips";
import { Trans, t } from "@lingui/macro";
import Identity, { CallbackProps } from "components/Identity";
import { formatTokenAmount, isValidAccount, numberToString, isValidPrincipal } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { ResultStatus, type ActorIdentity, type StatusResult } from "@icpswap/types";
import Button from "components/authentication/ButtonConnector";
import { useEvent, setClaimEventReady, setClaimEventState, setClaimEventData } from "@icpswap/hooks";
import { read, utils } from "xlsx";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import EventSelector from "./EventSelector";
import { Principal } from "@dfinity/principal";

type UserClaimItem = {
  address: string;
  amount: number;
};

type ExcelClaimItem = {
  address: string;
  amount: number;
  __rowNum__: number;
};

export default function EventConfig() {
  const [eventId, setEventId] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [openTip] = useTips();

  const [userClaims, setUserClaims] = useState<UserClaimItem[]>([]);
  const [inValidUserClaims, setInvalidUserClaims] = useState<ExcelClaimItem[]>([]);

  const { result: event } = useEvent(eventId);

  const { result: tokenInfo } = useTokenInfo(event?.tokenCid);

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

      let userClaims: UserClaimItem[] = [];
      let inValidUserClaims: ExcelClaimItem[] = [];

      for (let i = 0; i < xlsx.SheetNames.length; i++) {
        const sheetData = utils.sheet_to_json<ExcelClaimItem>(xlsx.Sheets[xlsx.SheetNames[i]]);

        for (let i = 0; i < sheetData.length; i++) {
          const address = sheetData[i].address;
          const amount = sheetData[i].amount;

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

  const ExcelTotalAmount = tokenInfo
    ? userClaims.reduce((prev, curr) => {
        return prev.plus(new BigNumber(curr.amount).toFixed(tokenInfo.decimals, BigNumber.ROUND_DOWN));
      }, new BigNumber(0))
    : new BigNumber(0);

  const States = [
    { label: "Live", value: "live" },
    { label: "Closed", value: "closed" },
  ];

  const handleSetReady = async (identity: ActorIdentity) => {
    const { status: status2, message: message2 } = await setClaimEventReady(eventId, identity);
    openTip(status2 === ResultStatus.OK ? "Set event ready successfully" : message2, status2);
  };

  const handleSetState = async (identity: ActorIdentity) => {
    const { status: status3, message: message3 } = await setClaimEventState(eventId, stateValue === "live", identity);
    openTip(status3 === ResultStatus.OK ? "Set event state successfully" : message3, status3);
  };

  const handleImportUserData = async (identity: ActorIdentity) => {
    if (!identity || !tokenInfo) return;

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
      promises.push(setClaimEventData(eventId, userClaims, identity));
    }

    await Promise.all(promises)
      .then((result) => {
        result.forEach((res) => {
          openTip(res.status === ResultStatus.OK ? t`Set event user data successfully` : res.message, res.status);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Box mt="30px" />

      <hr />

      <Box mt="30px" sx={{ display: "flex", flexDirection: "column", gap: "20px 0" }}>
        <Box sx={{ width: "600px" }}>
          <EventSelector value={eventId} onChange={(eventId: string) => setEventId(eventId)} />
        </Box>

        <Box sx={{ width: "100px" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "100px 200px", gap: "0 20px" }}>
            <Typography color="text.primary">Set Ready:</Typography>
            <Identity onSubmit={handleSetReady}>
              {({ submit, loading }: CallbackProps) => {
                return (
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!eventId || loading}
                    onClick={submit}
                    loading={loading}
                  >
                    {eventId ? "Ready" : "Select an event"}
                  </Button>
                );
              }}
            </Identity>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "100px 600px 200px", gap: "0 20px" }}>
          <Typography color="text.primary">Set State:</Typography>

          <FilledTextField
            select
            menus={States}
            placeholder={t`Select claim event`}
            onChange={(value: string) => setStateValue(value)}
            value={stateValue}
          />

          <Identity onSubmit={handleSetState}>
            {({ submit, loading }: CallbackProps) => (
              <Button variant="contained" fullWidth disabled={!eventId} onClick={submit} loading={loading}>
                {eventId ? "Set State" : "Select an event"}
              </Button>
            )}
          </Identity>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "120px 400px 200px 1fr", gap: "0 20px" }}>
          <Typography color="text.primary">Set User Data:</Typography>

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
          </Box>

          <Identity onSubmit={handleImportUserData}>
            {({ submit, loading }: CallbackProps) => (
              <Button variant="contained" fullWidth disabled={!eventId} onClick={submit} loading={loading}>
                {eventId ? "Set user data" : "Select an event"}
              </Button>
            )}
          </Identity>

          {!!userClaims.length || !!inValidUserClaims.length ? (
            <Box sx={{ display: "flex", gap: "0 10px" }}>
              <Typography component="span" fontSize="12px">
                {userClaims.length} valid accounts (TotalAmount: {ExcelTotalAmount.toFormat()})
              </Typography>

              {!!inValidUserClaims?.length ? (
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
      </Box>
    </>
  );
}
