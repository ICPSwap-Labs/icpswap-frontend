import { useTheme } from "components/Mui";
import { useDesignVersion } from "hooks/useDesignVersion";

import classicLogoDark from "../assets/design-classic/logo-dark.svg";
import classicLogoLight from "../assets/design-classic/logo-white.svg";
import logoDark from "../assets/images/logo-dark.svg";
import logo from "../assets/images/logo-white.svg";

export default function Logo() {
  const theme = useTheme();
  const { isClassicDesign } = useDesignVersion();
  const dark = theme.palette.mode === "dark";

  return (
    <img
      src={isClassicDesign ? (dark ? classicLogoDark : classicLogoLight) : dark ? logoDark : logo}
      alt=""
      width="100"
    />
  );
}
