import { Typography, Popper } from "components/Mui";
import { percentToNum, numToPercent } from "@icpswap/utils";
import { Null } from "@icpswap/types";

export interface SliderRefProps {
  setAmount: (value: string) => void;
}

export interface SliderPopperProps {
  open: boolean;
  popperAnchor: HTMLDivElement | null;
  value: string | Null;
}

export const SliderPopper = ({ open, popperAnchor, value }: SliderPopperProps) => {
  return (
    <Popper
      open={open}
      anchorEl={popperAnchor}
      placement="top"
      popperOptions={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 6],
            },
          },
        ],
      }}
    >
      <Typography component="div" className="tooltip-typography">
        <Typography
          sx={{
            color: "#111936",
            fontSize: "10px",
            padding: "4px",
            borderRadius: "4px",
            background: "#FFFFFF",
          }}
        >
          {value ? numToPercent(percentToNum(value), 2) : "0%"}
        </Typography>
      </Typography>
    </Popper>
  );
};
