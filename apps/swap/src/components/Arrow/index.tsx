import { SvgIconProps } from "components/Mui";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export function DownArrow(props: SvgIconProps) {
  return <ArrowDownwardIcon {...props} sx={{ width: "16px", height: "16px" }} />;
}

export function UpArrow(props: SvgIconProps) {
  return <ArrowDownwardIcon {...props} sx={{ transform: "rotate(180deg)", width: "16px", height: "16px" }} />;
}

export function RightArrow(props: SvgIconProps) {
  return <ArrowDownwardIcon {...props} sx={{ transform: "rotate(270deg)", width: "16px", height: "16px" }} />;
}

export function LeftArrow(props: SvgIconProps) {
  return <ArrowDownwardIcon {...props} sx={{ transform: "rotate(90deg)", width: "16px", height: "16px" }} />;
}
