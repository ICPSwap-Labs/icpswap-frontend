import { Box, makeStyles } from "components/Mui";
import { Position } from "@icpswap/swap-sdk";
import { usePositionState } from "hooks/liquidity";

const useStyle = ({ borderRadius = "12px" }: { borderRadius?: string }) => {
  return makeStyles(() => ({
    state: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "4px",
      height: "100%",
      borderTopLeftRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
      background: "#8492C4",

      "@media(max-width: 640px)": {
        top: 0,
        left: 0,
        width: "100%",
        height: "4px",
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: "0px",
        borderTopRightRadius: borderRadius,
      },

      "&.level0": {
        background: "#FFD24C",
      },

      "&.level1": {
        background: "#D3625B",
      },

      "&.outOfRange": {
        background: "#9D332C",
      },
    },
  }));
};

export interface LiquidityStateFlagProps {
  position: Position | undefined;
  borderRadius?: string;
}

export function LiquidityStateFlag({ position, borderRadius }: LiquidityStateFlagProps) {
  const classes = useStyle({ borderRadius })();
  const positionState = usePositionState(position);

  return <Box className={`${classes.state} ${positionState ?? ""}`} />;
}
