import { Box } from "components/Mui";
import { getStateColor, PositionState } from "utils/index";

export interface PositionRangeDotProps {
  state: PositionState | undefined;
  background?: string;
}

export function PositionRangeDot({ state, background }: PositionRangeDotProps) {
  return (
    <Box
      sx={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        "&.level0": {
          background: background ?? getStateColor(PositionState.InRange),
        },
        "&.level1": {
          background: background ?? getStateColor(PositionState.InRange),
        },
        "&.outOfRange": {
          background: background ?? getStateColor(PositionState.OutOfRange),
        },
        "&.closed": {
          background: background ?? getStateColor(PositionState.CLOSED),
        },
        "&.inRange": {
          background: background ?? getStateColor(PositionState.InRange),
        },
      }}
      className={state ?? ""}
    />
  );
}
