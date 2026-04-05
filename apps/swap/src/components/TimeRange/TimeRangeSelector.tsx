import { Flex, Modal } from "@icpswap/ui";
import { BigNumber, getLocalDayEndMs, getLocalDayStartMs, isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, type DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button, Typography } from "components/Mui";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const MAX_RANGE_TIMESTAMP = 180 * 24 * 3600 * 1000;

interface TimeRangeSelectorProps {
  open: boolean;
  startTime: number | string | undefined;
  endTime: number | string | undefined;
  onConfirm: (startTime: number, endTime: number) => void;
  onClose?: () => void;
}

export function TimeRangeSelector({ open, startTime, endTime, onConfirm, onClose }: TimeRangeSelectorProps) {
  const { t } = useTranslation();

  const [innerStartTime, setInnerStartTime] = useState<number | undefined>(undefined);
  const [innerEndTime, setInnerEndTime] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (startTime) {
      setInnerStartTime(Number(startTime));
    }

    if (endTime) {
      setInnerEndTime(Number(endTime));
    }
  }, [startTime, endTime]);

  const handleStartTimeChange: DatePickerProps["onChange"] = useCallback((value) => {
    if (value) {
      setInnerStartTime(value.valueOf() as number);
    }
    setInnerEndTime(undefined);
  }, []);

  const handleEndTimeChange: DatePickerProps["onChange"] = useCallback((value: any) => {
    if (value) {
      setInnerEndTime(value.valueOf() as number);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (nonUndefinedOrNull(innerStartTime) && nonUndefinedOrNull(innerEndTime)) {
      onConfirm(getLocalDayStartMs(innerStartTime), getLocalDayEndMs(innerEndTime));
    }
  }, [innerStartTime, innerEndTime, onConfirm]);

  const maxEndTime = useMemo(() => {
    const now = Date.now();

    if (isUndefinedOrNull(innerStartTime)) return dayjs(getLocalDayEndMs(now));
    if (new BigNumber(innerStartTime + MAX_RANGE_TIMESTAMP).isGreaterThan(now)) return dayjs(getLocalDayEndMs(now));

    return dayjs(getLocalDayEndMs(innerStartTime + MAX_RANGE_TIMESTAMP));
  }, [innerStartTime]);

  return (
    <Modal open={open} title={t("time.range.title")} onClose={onClose} onCancel={onClose}>
      <Typography>{t("time.range.desc")}</Typography>

      <Flex vertical gap="32px 0" align="flex-start" fullWidth sx={{ margin: "32px 0 0 0" }}>
        <Flex
          gap="0 12px"
          sx={{
            "@media(max-width: 640px)": {
              flexDirection: "column",
              gap: "12px 0",
              width: "100%",
            },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={nonUndefinedOrNull(innerStartTime) ? dayjs(innerStartTime) : null}
              onChange={handleStartTimeChange}
              format="YYYY-MM-DD"
              maxDate={dayjs(Date.now())}
              sx={{
                "@media(max-width: 640px)": {
                  width: "100%",
                },
              }}
            />
          </LocalizationProvider>
          <Typography color="text.primary">{t("common.to")}</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={nonUndefinedOrNull(innerEndTime) ? dayjs(innerEndTime) : null}
              onChange={handleEndTimeChange}
              format="YYYY-MM-DD"
              minDate={innerStartTime ? dayjs(innerStartTime) : dayjs()}
              maxDate={maxEndTime}
              sx={{
                "@media(max-width: 640px)": {
                  width: "100%",
                },
              }}
            />
          </LocalizationProvider>
        </Flex>

        <Button fullWidth size="large" variant="contained" onClick={handleConfirm}>
          {t("common.confirm")}
        </Button>
      </Flex>
    </Modal>
  );
}
