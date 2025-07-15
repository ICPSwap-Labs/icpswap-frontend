import { useCallback, useEffect, useState } from "react";
import { Flex, Modal } from "@icpswap/ui";
import { Button, Typography } from "components/Mui";
import { BigNumber, nonUndefinedOrNull } from "@icpswap/utils";
import { useTranslation } from "react-i18next";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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
      onConfirm(innerStartTime, innerEndTime);
    }
  }, [innerStartTime, innerEndTime]);

  return (
    <Modal open={open} title={t("time.range.title")} onClose={onClose} onCancel={onClose}>
      <Typography>{t("time.range.desc")}</Typography>

      <Flex vertical gap="32px 0" align="flex-start" fullWidth sx={{ margin: "32px 0 0 0" }}>
        <Flex gap="0 12px">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dayjs(innerStartTime)}
              onChange={handleStartTimeChange}
              format="YYYY-MM-DD"
              minDate={
                innerEndTime
                  ? dayjs(new BigNumber(innerEndTime).minus(180 * 24 * 60 * 60 * 1000).toNumber())
                  : undefined
              }
              maxDate={innerEndTime ? dayjs(innerEndTime) : undefined}
            />
          </LocalizationProvider>
          <Typography color="text.primary">{t("common.to")}</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dayjs(innerEndTime)}
              onChange={handleEndTimeChange}
              format="YYYY-MM-DD"
              minDate={innerStartTime ? dayjs(innerStartTime) : undefined}
              maxDate={
                innerStartTime
                  ? dayjs(new BigNumber(innerStartTime).plus(180 * 24 * 60 * 60 * 1000).toNumber())
                  : undefined
              }
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
