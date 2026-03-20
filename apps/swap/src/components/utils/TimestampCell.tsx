import { BodyCell, Tooltip } from "@icpswap/ui";
import dayjs from "dayjs";
import { useAbbreviatedTimeString } from "hooks/utils/time";
import { DAYJS_FORMAT } from "constants/index";

/**
 * Renders a table cell that shows an abbreviated relative time (e.g. "2h ago")
 * and displays the full formatted date/time in a tooltip on hover.
 *
 * @param {number} timestamp - Unix timestamp in milliseconds to display.
 * @returns {React.ReactNode} The rendered table cell.
 */
export const TimestampCell = ({ timestamp }: { timestamp: number }) => {
  const abbreviatedTime = useAbbreviatedTimeString(timestamp);

  return (
    <Tooltip tips={dayjs(timestamp).format(DAYJS_FORMAT)} placement="top">
      <BodyCell>{abbreviatedTime}</BodyCell>
    </Tooltip>
  );
};
