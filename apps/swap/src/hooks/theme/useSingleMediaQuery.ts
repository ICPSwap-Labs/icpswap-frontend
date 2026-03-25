import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "components/Mui";

export function useMediaQuery640() {
  return useMediaQuery("(max-width:640px)");
}

export function useMediaQuery760() {
  return useMediaQuery("(max-width: 760px)");
}

export function useMediaQuery1160() {
  return useMediaQuery("(max-width:1290px)");
}

export function useMediaQuery1290() {
  return useMediaQuery("(max-width:1290px)");
}

export function useMediaQuerySM() {
  const theme = useTheme();

  return useMediaQuery(theme.breakpoints.down("sm"));
}

export function useMediaQueryMD() {
  const theme = useTheme();

  return useMediaQuery(theme.breakpoints.down("md"));
}
