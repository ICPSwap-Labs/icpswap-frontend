import Logo from "components/Logo";
import { ButtonBase } from "components/Mui";
import { Link } from "react-router-dom";

export default function LogoSection() {
  return (
    <ButtonBase
      disableRipple
      component={Link}
      to="/"
      sx={{
        flexShrink: 0,
        borderRadius: "8px",
        "& img": { width: "125px", height: "32px", objectFit: "contain" },
        "&:focus-visible": { outline: "2px solid var(--color-primary)", outlineOffset: "6px" },
        "@media(max-width: 640px)": { "& img": { width: "106px" } },
      }}
    >
      <Logo />
    </ButtonBase>
  );
}
