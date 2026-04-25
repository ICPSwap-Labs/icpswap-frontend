import Logo from "components/Logo";
import { ButtonBase } from "components/Mui";
import { Link } from "react-router-dom";

export default function LogoSection() {
  return (
    <ButtonBase disableRipple component={Link} to="/">
      <Logo />
    </ButtonBase>
  );
}
