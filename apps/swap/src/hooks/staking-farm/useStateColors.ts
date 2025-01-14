import type { FarmState, Null } from "@icpswap/types";

export const COLORS = {
  NOT_START: "#5669DC",
  LIVE: "#54C081",
  FINISHED: "#8492C4",
  CLOSED: "#8492C4",
  DEFAULT: "#8492C4",
};

export function useStateColors(state: FarmState | Null): string {
  return COLORS[state ?? "DEFAULT"];
}
