import { useCallback, useEffect, useMemo, useState } from "react";
import { Flex, Modal } from "@icpswap/ui";
import { Button, Typography } from "components/Mui";
import { BigNumber, isUndefinedOrNull, nonUndefinedOrNull, toEndTimeOfDay, toStartTimeOfDay } from "@icpswap/utils";
import { useTranslation } from "react-i18next";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const MAX_RANGE_TIMESTAMP = 180 * 24 * 3600 * 1000;

interface TimeRangeSelectorProps {
  open: boolean;
  startTime: number | string | undefined;
  endTime: number | string | undefined;
  onStartTimeChange?: (milliseconds: number) => void;
  onEndTimeChange?: (milliseconds: number) => void;
  onConfirm: (startTime: number, endTime: number) => void;
  onClose?: () => void;
}

export function TimeRangeSelector({
  open,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onConfirm,
  onClose,
}: TimeRangeSelectorProps) {
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

  const handleStartTimeChange: DatePickerProps["onChange"] = useCallback(
    (value) => {
      if (value) {
        setInnerStartTime(value.valueOf() as number);
      }
      setInnerEndTime(undefined);
    },
    [onStartTimeChange],
  );

  const handleEndTimeChange: DatePickerProps["onChange"] = useCallback(
    (value: any) => {
      if (value) {
        setInnerEndTime(value.valueOf() as number);
      }
    },
    [onEndTimeChange],
  );

  const handleConfirm = useCallback(() => {
    if (nonUndefinedOrNull(innerStartTime) && nonUndefinedOrNull(innerEndTime)) {
      onConfirm(toStartTimeOfDay(innerStartTime), toEndTimeOfDay(innerEndTime));
    }
  }, [innerStartTime, innerEndTime]);

  const maxEndTime = useMemo(() => {
    const now = new Date().getTime();

    if (isUndefinedOrNull(innerStartTime)) return dayjs(toEndTimeOfDay(now));
    if (new BigNumber(innerStartTime + MAX_RANGE_TIMESTAMP).isGreaterThan(now)) return dayjs(toEndTimeOfDay(now));

    return dayjs(toEndTimeOfDay(innerStartTime + MAX_RANGE_TIMESTAMP));
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
              maxDate={dayjs(new Date().getTime())}
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
