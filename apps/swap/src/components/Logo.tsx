import { useTheme } from "components/Mui";

import logoDark from "../assets/images/logo-dark.svg";
import logo from "../assets/images/logo-white.svg";

export default function Logo() {
  const theme = useTheme();

  return <img src={theme.palette.mode === "dark" ? logoDark : logo} alt="" width="100" />;
}
