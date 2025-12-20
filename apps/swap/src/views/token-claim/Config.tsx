/* eslint-disable no-param-reassign */
import React, { useCallback, useState } from "react";
import { Typography, Box, Input } from "components/Mui";
import { FilledTextField, AuthButton } from "components/index";
import { MessageTypes, useTips } from "hooks/useTips";
import {
  formatTokenAmount,
  isValidAccount,
  numberToString,
  isValidPrincipal,
  BigNumber,
  isUndefinedOrNull,
} from "@icpswap/utils";
import { ResultStatus, type StatusResult } from "@icpswap/types";
import {
  useEvent,
  setClaimEventReady,
  setClaimEventState,
  setClaimEventData,
  useLoadingCallData,
} from "@icpswap/hooks";
import { read, utils } from "xlsx";
import { useToken } from "hooks/index";
import { Principal } from "@dfinity/principal";
import { useTranslation } from "react-i18next";

import EventSelector from "./EventSelector";

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
  const { t } = useTranslation();
  const [eventId, setEventId] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [openTip] = useTips();

  const [userClaims, setUserClaims] = useState<UserClaimItem[]>([]);
  const [inValidUserClaims, setInvalidUserClaims] = useState<ExcelClaimItem[]>([]);

  const { result: event } = useEvent(eventId);

  const [, token] = useToken(event?.tokenCid);

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

  const ExcelTotalAmount = token
    ? userClaims.reduce((prev, curr) => {
        return prev.plus(new BigNumber(curr.amount).toFixed(token.decimals, BigNumber.ROUND_DOWN));
      }, new BigNumber(0))
    : new BigNumber(0);

  const States = [
    { label: "Live", value: "live" },
    { label: "Closed", value: "closed" },
  ];

  const { loading: setReadLoading, callback: handleSetReady } = useLoadingCallData(
    useCallback(async () => {
      const { status, message } = await setClaimEventReady(eventId);
      openTip(status === ResultStatus.OK ? "Set event ready successfully" : message, status);
    }, [eventId]),
  );

  const { loading, callback: handleSetState } = useLoadingCallData(
    useCallback(async () => {
      const { status: status3, message: message3 } = await setClaimEventState(eventId, stateValue === "live");
      openTip(status3 === ResultStatus.OK ? "Set event state successfully" : message3, status3);
    }, [eventId, stateValue]),
  );

  const { loading: uploadDataLoading, callback: handleImportUserData } = useLoadingCallData(
    useCallback(async () => {
      if (isUndefinedOrNull(token)) return;

      const _userClaims = userClaims.map((ele) => ({
        user: isValidPrincipal(ele.address) ? { principal: Principal.fromText(ele.address) } : { address: ele.address },
        quota: BigInt(
          numberToString(
            formatTokenAmount(new BigNumber(ele.amount).toFixed(token.decimals, BigNumber.ROUND_DOWN), token.decimals),
          ),
        ),
      }));

      const promises: Promise<StatusResult<boolean>>[] = [];

      for (let i = 0; i < _userClaims.length; i += 20000) {
        const userClaims = _userClaims.slice(i, i + 20000);
        promises.push(setClaimEventData(eventId, userClaims));
      }

      await Promise.all(promises)
        .then((result) => {
          result.forEach((res) => {
            openTip(res.status === ResultStatus.OK ? t`Set event user data successfully` : res.message, res.status);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }, [token, userClaims]),
  );

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
            <AuthButton
              variant="contained"
              fullWidth
              disabled={!eventId || setReadLoading}
              onClick={handleSetReady}
              loading={setReadLoading}
            >
              {eventId ? "Ready" : "Select an event"}
            </AuthButton>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "100px 600px 200px", gap: "0 20px" }}>
          <Typography color="text.primary">Set State:</Typography>

          <FilledTextField
            select
            menus={States}
            placeholder={t("claim.select.event")}
            onChange={(value: string) => setStateValue(value)}
            value={stateValue}
          />

          <AuthButton variant="contained" fullWidth disabled={!eventId} onClick={handleSetState} loading={loading}>
            {eventId ? "Set State" : "Select an event"}
          </AuthButton>
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
            <AuthButton variant="outlined" fullWidth size="large" loading={importLoading}>
              {t("claim.import.data")}
            </AuthButton>
          </Box>

          <AuthButton
            variant="contained"
            fullWidth
            disabled={!eventId}
            onClick={handleImportUserData}
            loading={uploadDataLoading}
          >
            {eventId ? "Set user data" : "Select an event"}
          </AuthButton>

          {!!userClaims.length || !!inValidUserClaims.length ? (
            <Box sx={{ display: "flex", gap: "0 10px" }}>
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
      </Box>
    </>
  );
}
