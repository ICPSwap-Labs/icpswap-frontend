import { useCallback, useEffect, useRef, useState } from "react";
import { Flex, DropDownMenu } from "@icpswap/ui";
import { Box, Typography, useTheme } from "components/Mui";
import { BigNumber, nonUndefinedOrNull, toEndTimeOfDay, toStartTimeOfDay } from "@icpswap/utils";
import { ChevronDown } from "react-feather";
import { TimeRangeSelector } from "components/TimeRange/TimeRangeSelector";
import dayjs from "dayjs";

type RangeValue = { value: number; label: string };

const TimeRanges: Array<RangeValue> = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
  { value: 180, label: "Last 180 days" },
  { value: 0, label: "Custom Range" },
];

interface TimeRangeProps {
  defaultRange?: number;
  onChange: (startTime: number, endTime: number) => void;
}

export function TimeRange({ defaultRange, onChange }: TimeRangeProps) {
  const ref = useRef(null);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
  const [range, setRange] = useState<RangeValue | undefined>(undefined);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);

  const [startTime, setStartTime] = useState<number | string | undefined>(undefined);
  const [endTime, setEndTime] = useState<number | string | undefined>(undefined);

  const handleSetRange = useCallback(
    (rangeValue: number) => {
      const range = TimeRanges.find((range) => range.value === rangeValue);
      if (range) {
        setRange(range);
      }
    },
    [setRange, onChange],
  );

  // Set default range
  useEffect(() => {
    if (nonUndefinedOrNull(defaultRange)) {
      handleSetRange(defaultRange);
    }
  }, [defaultRange, handleSetRange]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.target);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTimeRangeChange = useCallback(
    (value: number) => {
      const __range = TimeRanges.find((element) => element.value === value);

      if (nonUndefinedOrNull(__range)) {
        if (__range.value === 0) {
          setDateRangeOpen(true);
        } else {
          if (__range.value === range?.value) return;

          const now = new Date().getTime();
          const start = new BigNumber(now)
            .minus(new BigNumber(__range.value).multipliedBy(24).multipliedBy(3600).multipliedBy(1000))
            .toNumber();

          onChange(start, now);
          setRange(__range);
        }
      }
    },
    [onChange, range, setRange],
  );

  // Set default startTime/endTime
  useEffect(() => {
    const now = new Date().getTime();
    const endTime = toEndTimeOfDay(now);

    setEndTime(endTime);
    setStartTime(toStartTimeOfDay(new BigNumber(endTime).minus(180 * 24 * 3600 * 1000).toString()));
  }, []);

  const handleRangeDateChange = useCallback(
    (startTime: number, endTime: number) => {
      setStartTime(startTime);
      setEndTime(endTime);
      setDateRangeOpen(false);
      handleSetRange(0);
      onChange(startTime, endTime);
    },
    [onChange, handleSetRange],
  );

  const handleRangeSelectorClose = useCallback(() => {
    setDateRangeOpen(false);
  }, [setDateRangeOpen, handleSetRange]);

  return (
    <>
      <Box
        ref={ref}
        onClick={handleClick}
        sx={{
          minWidth: "240px",
          borderRadius: "12px",
          background: theme.palette.background.level1,
          cursor: "pointer",
          height: "40px",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Flex fullWidth gap="0 8px" justify="space-between" sx={{ lineHeight: "16px" }}>
          <Typography>Time Range</Typography>
          <Typography color="text.primary" sx={{ width: "120px" }} className="text-overflow-ellipsis">
            {range
              ? range.value === 0
                ? startTime && endTime
                  ? `${dayjs(startTime).format("YYYY-MM-DD")} To ${dayjs(endTime).format("YYYY-MM-DD")}`
                  : range?.label
                : range?.label
              : ""}
          </Typography>
          <ChevronDown size={16} />
        </Flex>
      </Box>

      <DropDownMenu
        value={range?.value}
        anchor={anchorEl}
        onMenuClick={handleClose}
        onClose={handleClose}
        menus={TimeRanges}
        minMenuWidth="140px"
        onChange={handleTimeRangeChange}
        menuWidth={240}
      />

      {dateRangeOpen ? (
        <TimeRangeSelector
          open
          startTime={startTime}
          endTime={endTime}
          onConfirm={handleRangeDateChange}
          onClose={handleRangeSelectorClose}
        />
      ) : null}
    </>
  );
}
