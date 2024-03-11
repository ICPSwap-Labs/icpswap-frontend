import { useTheme } from "@mui/material/";
import logoDark from "../assets/images/logo-dark.svg";
import logo from "../assets/images/logo-white.svg";
import { Theme } from "@mui/material/styles";

export default function Logo() {
  const theme = useTheme() as Theme;

  return <img src={theme.palette.mode === "dark" ? logoDark : logo} alt="" width="100" />;
}
